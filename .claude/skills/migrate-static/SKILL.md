---
name: migrate-static
description: Use this skill when a static .njk template exists for the block. Trigger phrases include "migrate static", "static is ready", "create block from static", "update block from static", "the static template exists", or when the user references a static/src/partials/blocks/ path.
version: 1.0.0
---

# Migrate Static Skill

> If no static template exists yet, use `/register-block` instead — it gathers requirements from the user and creates placeholder files.

The static Nunjucks template is the primary source of truth. Read it first — it defines the attributes, controls, and HTML structure. Then check which block files already exist, report the create-vs-update plan, and proceed.

---

## Step 0 — Read the Static Template

Find and read `static/src/partials/blocks/{folder}/{folder}.njk`.

If the user didn't specify the folder name, ask for it before proceeding.

The template has two parts to analyze:

### Part A — JSDoc comment (props declaration)

Every prop listed here maps to a block attribute. Read the type and the options list:

```njk
/**
 * @param {string} title
 * @param {string} size - default | large
 * @param {string} alignment - start | center | end
 * @param {boolean} isIncludeOverlay
 * @param {string} bg          ← color value
 * @param {string} color       ← color value
 * @param {object} image       ← media
 */
```

### Part B — Template body (conditionals, loops, inline styles)

Read all `{% if %}`, `{% for %}`, `{% if x == 'value' %}`, and inline `style="--var: {{ prop }}"` usages.

---

## Step 1 — Map Props to Attributes and Controls

Apply these rules to every prop found in the static template:

### Attribute type mapping

| Static pattern | block.json attribute type | Default |
|---------------|--------------------------|---------|
| `{string}` with `- opt1 \| opt2` options | `"string"` + `"enum"` | first option |
| `{string}` free text (title, label, etc.) | `"string"` | `""` |
| `{string}` that is a color (`bg`, `color`, `backgroundColor`, etc.) | `"object"` → `{ "value": "...", "slug": "..." }` | theme primary |
| `{boolean}` | `"boolean"` | `false` |
| `{object}` image/media | `"object"` → `{ "id": null, "url": null, "alt": null }` | as shown |
| `{number}` | `"number"` | depends |
| `{array}` of items | `"array"` | `[]` — or consider InnerBlocks if items are complex content |
| `{% for item in items %}` in the body | InnerBlocks child block (if items have rich content) or `"array"` attribute (if items are simple data) |

### Control type mapping

| Attribute | Editor control |
|-----------|---------------|
| `boolean` | `<ToggleControl>` |
| `string` free text | `<TextControl>` |
| `string` HTML content | `<RichText>` in edit, `<RichText.Content>` in save |
| `string` enum with 2–4 options | `<ToggleGroupControl>` (use `__experimentalToggleGroupControl`) |
| `string` enum with 5+ options | `<RadioControl>` |
| `object {value, slug}` color | `<ColorPaletteControl>` from `@secretstache/wordpress-gutenberg` |
| `object {id, url, alt}` media | `<MediaUpload>` + `<MediaUploadCheck>` |
| `number` bounded | `<RangeControl>` with min/max/step |

### Render strategy decision

Answer these from the template:
- Does it have a `{% for item in items %}` loop that queries a CPT or ACF field? → **server-side**
- Does it use `get_field()`, `get_the_title()`, or similar WP functions? → **server-side**
- Does it have InnerBlocks children? → **server-side** (parent), **client-side** (child)
- Is it purely presentational with no DB data? → **client-side save**

---

## Step 2 — Plan the HTML Migration

Before writing any code, mentally map the Nunjucks template to its target:

**Server-rendered → Blade template**

| Nunjucks | Blade |
|----------|-------|
| Root `<div class="wp-block-ssm-..." {{ classes }}{{ styles }}>` | `<div {!! $wrapper_attributes !!}>` |
| `{{ props.text }}` | `{{ $text }}` (escaped) |
| `{!! props.html !!}` / WP function output | `{!! $html !!}` (unescaped) |
| `{% if props.x %}` | `@if ($x)` |
| `{% if props.x == 'value' %}` | `@if ($x === 'value')` |
| `{% for item in items %}` | `@foreach ($items as $item)` |
| `{% set x = props.x or 'default' %}` | (handle in PHP `prepareData`, pass as variable) |
| `style="--var: {{ props.color }}"` | `style="--var: {{ $color }}"` — or via CSS custom property in wrapper |
| Conditional CSS class `'cls' if condition` | `@class(['cls' => $condition])` |
| `{{ Vite::asset('path') }}` equivalent | `{{ Vite::asset('resources/images/...') }}` |

**Client-side → `save.jsx`**

| Nunjucks | JSX |
|----------|-----|
| `{{ props.text }}` | `{text}` |
| `{% if props.x %}` | `{x && (...)}` |
| `{% for item in items %}` | `{items.map((item, i) => (...))}` |
| `style="--var: {{ props.color }}"` | `style={{ '--var': color }}` |
| Conditional class | template literal or `classnames()` |
| `<RichText>` HTML output | `<RichText.Content tagName="p" value={quote} />` |

---

## Step 3 — Check Existing Files

Scan for each of these files and note whether it exists:

- `resources/scripts/editor/blocks/{folder}/block.json`
- `resources/scripts/editor/blocks/{folder}/index.js`
- `resources/scripts/editor/blocks/{folder}/edit.jsx`
- `resources/scripts/editor/blocks/{folder}/save.jsx`
- `resources/scripts/editor/blocks/{folder}/` (directory itself)
- `app/Blocks/{ClassName}.php`
- `resources/views/blocks/{folder}/index.blade.php`
- `resources/styles/blocks/{folder}.css`

For each file: **"create"** if absent, **"update"** if present.

**Report the plan to the user before writing anything.** Example:

```
Here is what I'll do for block `ssm/promo-banner`:

CREATE:
  • resources/scripts/editor/blocks/promo-banner/block.json
  • resources/scripts/editor/blocks/promo-banner/index.js
  • resources/scripts/editor/blocks/promo-banner/edit.jsx
  • resources/scripts/editor/blocks/promo-banner/save.jsx
  • app/Blocks/PromoBanner.php
  • resources/views/blocks/promo-banner/index.blade.php

UPDATE:
  (none — all files are new)

Proceed?
```

If existing files are found, list them under UPDATE and note what will change (e.g. "update attributes in block.json", "add migrated markup to Blade template").

Wait for user confirmation before writing.

---

## Step 4 — Derive Names

| Item | Convention | Example |
|------|-----------|---------|
| Folder | kebab-case | `promo-banner` |
| Block slug | `{namespace}/{folder}` | `ssm/promo-banner` |
| PHP class | PascalCase | `PromoBanner` |
| CSS root | `wp-block-{namespace}-{folder}` | `wp-block-ssm-promo-banner` |
| BEM element | `wp-block-{namespace}-{folder}__{el}` | `wp-block-ssm-promo-banner__title` |

---

## Step 5 — `block.json`

`resources/scripts/editor/blocks/{folder}/block.json`

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "ssm/block-slug",
  "title": "Block Title",
  "description": "Short description.",
  "keywords": ["keyword1", "keyword2"],
  "category": "ssm-components",
  "icon": "block-default",
  "supports": {
    "spacing": { "margin": true, "padding": true },
    "align": ["wide", "full"]
  },
  "attributes": {}
}
```

Add `"render": "index"` for server-rendered blocks only.

Category: `"ssm-components"` for standalone blocks, `"ssm-templates"` for layout/container blocks.

---

## Step 6 — `index.js`

`resources/scripts/editor/blocks/{folder}/index.js`

**Client-side block:**
```js
import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.jsx';
import { save } from './save.jsx';
import blockMetadata from './block.json';

registerBlockType(blockMetadata, { edit, save });
```

**Server-rendered or InnerBlocks block:**
```js
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { InnerBlocksCleanupFilter } from '@secretstache/wordpress-gutenberg';

import { edit } from './edit.jsx';
import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save: () => <InnerBlocks.Content />,
});

const innerBlocksCleanupFilter = new InnerBlocksCleanupFilter(blockMetadata.name);
innerBlocksCleanupFilter.add();
```

**Child block with custom List View label:**
```js
registerBlockType(blockMetadata, {
    edit,
    save,
    __experimentalLabel: (attributes, { context }) => {
        const customName = attributes?.metadata?.name;
        if (context === 'list-view' && (customName || attributes.title)) {
            return customName || attributes.title;
        }
    },
});
```

---

## Step 7 — `edit.jsx`

`resources/scripts/editor/blocks/{folder}/edit.jsx`

The edit component has two parts: **InspectorControls** (sidebar) and the **block preview** (canvas). The canvas preview should mirror the static template structure as closely as possible using the attribute values.

```jsx
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
    PanelBody,
    ToggleControl,
    TextControl,
    RangeControl,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    __experimentalDivider as Divider,
} from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import { ColorPaletteControl } from '@secretstache/wordpress-gutenberg';

export const edit = ({ attributes, setAttributes }) => {
    const { isEnabled, label, size, accentColor } = attributes;

    const blockProps = useBlockProps({
        className: 'wp-block-ssm-block-slug',
    });

    const onSizeChange = useCallback((size) => {
        setAttributes({ size });
    }, []);

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">

                    <ToggleControl
                        label="Enable feature"
                        checked={isEnabled}
                        onChange={(isEnabled) => setAttributes({ isEnabled })}
                    />

                    <Divider />

                    <ToggleGroupControl
                        isBlock
                        label="Size"
                        value={size}
                        onChange={onSizeChange}
                    >
                        <ToggleGroupControlOption value="default" label="Default" />
                        <ToggleGroupControlOption value="large" label="Large" />
                    </ToggleGroupControl>

                    <Divider />

                    <ColorPaletteControl
                        label="Accent Color"
                        value={accentColor?.value}
                        attributeName="accentColor"
                        setAttributes={setAttributes}
                    />

                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {/* Preview — mirrors the static template structure */}
            </div>
        </>
    );
};
```

**Key rules:**
- `useBlockProps()` always on the outermost wrapper.
- `ColorPaletteControl`: `value={color?.value}` — pass the string, not the whole object.
- `ToggleGroupControl` / `ToggleGroupControlOption` are `__experimental` — import with that prefix.
- `__experimentalDivider as Divider` — between control groups inside a PanelBody.
- Use `useCallback` for handlers passed as props; inline `onChange` is fine otherwise.
- Destructure all used attributes at the top.

**Inline styles from static template CSS variables:**
```jsx
// Static: style="--icon-bg: {{ bg }}; --icon-color: {{ color }}"
const tileStyle = {
    '--icon-bg': bgColor?.value || DEFAULT_BG,
    '--icon-color': accentColor?.value || DEFAULT_COLOR,
};
<div style={tileStyle}>...</div>
```

**InnerBlocks:**
```jsx
import { useInnerBlocksProps } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = ['ssm/child-block'];
const TEMPLATE = [['ssm/child-block', {}]];

const blockProps = useBlockProps();
const innerBlocksProps = useInnerBlocksProps(blockProps, {
    allowedBlocks: ALLOWED_BLOCKS,
    template: TEMPLATE,
    renderAppender: InnerBlocks.DefaultBlockAppender,
});

return <div {...innerBlocksProps} />;
```

**Data query blocks:**
```jsx
import { select } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import {
    ResourcesWrapper,
    DataQueryControls,
    useDataQuery,
} from '@secretstache/wordpress-gutenberg';

const QUERY_TYPE = { ALL: 'all', BY_CATEGORY: 'by_category', CURATED: 'curated' };
const POST_TYPE  = { ITEM: 'my_post_type' };
const TAXONOMY   = { CATEGORY: 'my_taxonomy' };

const { queryType, curatedTerms, curatedPosts, numberOfPosts } = attributes;

const isQueryTypeCurated    = queryType === QUERY_TYPE.CURATED;
const isQueryTypeByCategory = queryType === QUERY_TYPE.BY_CATEGORY;

const isEmptySelection =
    (isQueryTypeCurated && !curatedPosts?.length) ||
    (isQueryTypeByCategory && !curatedTerms?.length);

const queryConfig = useMemo(() => ({
    postType: POST_TYPE.ITEM,
    taxonomySlug: TAXONOMY.CATEGORY,
    curatedTermsIds: isQueryTypeByCategory && curatedTerms,
    curatedPostsIds: isQueryTypeCurated && curatedPosts?.map((post) => post.value),
    numberOfPosts: !isQueryTypeCurated ? numberOfPosts : -1,
    extraQueryArgs: {},
}), [queryType, curatedTerms, curatedPosts, numberOfPosts]);

const { postsToShow, isResolving, isEmpty } = useDataQuery(
    queryConfig,
    [queryType, curatedTerms, curatedPosts, numberOfPosts],
);
```

**Toolbar controls:**
```jsx
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { replace } from '@wordpress/icons';

<BlockControls>
    <ToolbarButton icon={replace} label="Change image" onClick={openModal} />
</BlockControls>
```

---

## Step 8 — `save.jsx` (client-side blocks only)

Migrate the Nunjucks HTML to JSX. Follow the mapping from Step 2.

```jsx
import { useBlockProps } from '@wordpress/block-editor';

export const save = ({ attributes }) => {
    const { title, size, accentColor } = attributes;

    if (!title) return null;

    const blockProps = useBlockProps.save({
        className: 'wp-block-ssm-block-slug',
    });

    return (
        <div {...blockProps}>
            {/* Migrated from static template */}
        </div>
    );
};
```

Rules:
- `useBlockProps.save()` — not `useBlockProps()`.
- Return `null` if required attributes are missing.
- `<RichText.Content tagName="p" value={quote} />` for rich text output.
- Skip for server-rendered blocks.

---

## Step 9 — Register in `editor.js`

Add to the block import list in alphabetical order:
```js
import './blocks/block-slug';
```

Skip if the import already exists.

---

## Step 10 — PHP Class (server-rendered blocks only)

`app/Blocks/{ClassName}.php`

Extract attributes from the static template's JSDoc, process them, and pass to Blade.

```php
<?php

namespace App\Blocks;

class ClassName extends Block
{
    protected function prepareData($attributes, $content): array
    {
        $label   = $attributes['label'] ?? '';
        $size    = $attributes['size'] ?? 'default';
        $color   = $attributes['accentColor'] ?? [];

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => 'flex flex-col',
        ]);

        return [
            'wrapper_attributes' => $wrapper_attributes,
            'label'              => $label,
            'size'               => $size,
            'color'              => $color,
            'content'            => $content,
        ];
    }
}
```

Rules:
- Class filename is PascalCase. Auto-loader converts `ClassName` → `class-name` as folder name — verify they match.
- `get_block_wrapper_attributes()` merges editor classes/styles — always use it.
- Pass `data-*` attributes through the wrapper array for JS hooks.
- Every `$attributes` key needs a `?? default` fallback.
- Color objects: use `$color['value']` for the hex and `$color['slug']` for the CSS var.

---

## Step 11 — Blade Template (server-rendered blocks only)

`resources/views/blocks/{folder}/index.blade.php`

Migrate the Nunjucks HTML using the mapping from Step 2. The template body of the `.njk` macro becomes the Blade file content.

```blade
@php
    /**
     * @var $wrapper_attributes  string
     * @var $label               string
     * @var $size                string
     * @var $color               array
     * @var $content             string
     */
@endphp

<div {!! $wrapper_attributes !!}>

    @if ($label)
        <p class="text-charcoal">{{ $label }}</p>
    @endif

    @if ($size === 'large')
        {{-- large variant markup --}}
    @endif

    {!! $content !!}

</div>
```

Rules:
- `@php /** @var ... */ @endphp` listing every variable at the top.
- `{!! $wrapper_attributes !!}` on the outermost element — never `{{ }}`.
- `{!! $content !!}` for InnerBlocks or inner post content.
- `{!! $html !!}` for trusted HTML from WP functions (`get_field()`, `get_the_title()`).
- `{{ $text }}` for plain escaped text.
- `@class(['class' => $condition])` for conditional CSS classes.
- Inline CSS variables:
  ```blade
  @if (!empty($color['value']))
      style="--accent: {{ $color['value'] }}"
  @endif
  ```

---

## Step 12 — CSS (if needed)

`resources/styles/blocks/{folder}.css`

Only needed for things Tailwind cannot express: keyframe animations, complex selectors, CSS custom property fallbacks. Most blocks need no CSS file.

---

## Final Checklist

- [ ] Static template read and all props mapped to attributes/controls
- [ ] Existing files scanned; create-vs-update plan reported and confirmed by user
- [ ] `block.json` — all attributes match the static props, `"render": "index"` only if server-rendered
- [ ] `index.js` — correct pattern; `InnerBlocksCleanupFilter` if InnerBlocks; `__experimentalLabel` if child block
- [ ] `edit.jsx` — controls match every configurable prop; canvas preview mirrors static structure; `ColorPaletteControl` uses `value={color?.value}`
- [ ] `save.jsx` — HTML migrated from static template; `useBlockProps.save()`; `null` guard (client-side only)
- [ ] `editor.js` — import in alphabetical order (skip if already present)
- [ ] `app/Blocks/{ClassName}.php` — every attribute extracted with `?? default`; `wrapper_attributes` always present (server-rendered only)
- [ ] `resources/views/blocks/{folder}/index.blade.php` — HTML migrated from static template (server-rendered only)
- [ ] `resources/styles/blocks/{folder}.css` — only if needed
