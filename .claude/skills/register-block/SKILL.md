---
name: register-block
description: Use this skill when the user asks to register a block without a static template. Trigger phrases include "register a block", "create a block", "add a new block", "new block called", "prepare a block", "block scaffold".
version: 4.0.0
---

# Register Block Skill

> If a static `.njk` template already exists for this block, use `/migrate-static` instead — it derives attributes and controls from the template automatically.

The user provides requirements directly. Gather everything needed before writing any files.

---

## Step 0 — Gather Requirements

Ask the user for the following before proceeding. Do not proceed until all are confirmed.

1. **Block name** — human-readable name (e.g. "Promo Banner")
2. **Render strategy** — client-side (save.jsx) or server-side (PHP + Blade)?
3. **InnerBlocks?** — does this block contain child blocks?
4. **Attributes** — for each attribute: name, type (`string` / `boolean` / `number` / `object` / `array`), default value, and any options if it's an enum string
5. **Any other constraints** — data query (CPT/taxonomy), toolbar controls, special layout requirements

Use this mapping to decide which editor control to generate for each attribute:

| Attribute type | Editor control |
|----------------|---------------|
| `boolean` | `<ToggleControl>` |
| `string` free text | `<TextControl>` |
| `string` HTML content | `<RichText>` in edit, `<RichText.Content>` in save |
| `string` enum, 2–4 options | `<ToggleGroupControl>` (`__experimentalToggleGroupControl`) |
| `string` enum, 5+ options | `<RadioControl>` |
| `object {value, slug}` color | `<ColorPaletteControl>` from `@secretstache/wordpress-gutenberg` |
| `object {id, url, alt}` media | `<MediaUpload>` + `<MediaUploadCheck>` |
| `number` bounded | `<RangeControl>` with min/max/step |

---

## Step 1 — Derive Names

| Item | Convention | Example |
|------|-----------|---------|
| Folder | kebab-case | `promo-banner` |
| Block slug | `{namespace}/{folder}` | `ssm/promo-banner` |
| PHP class | PascalCase | `PromoBanner` |
| CSS root | `wp-block-{namespace}-{folder}` | `wp-block-ssm-promo-banner` |
| BEM element | `wp-block-{namespace}-{folder}__{el}` | `wp-block-ssm-promo-banner__title` |

---

## Step 2 — `block.json`

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

## Step 3 — `index.js`

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

## Step 4 — `edit.jsx`

`resources/scripts/editor/blocks/{folder}/edit.jsx`

The edit component has two parts: **InspectorControls** (sidebar) and the **block preview** (canvas).

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
                {/* Preview placeholder — no static template yet */}
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

## Step 5 — `save.jsx` (client-side blocks only)

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
            {/* Placeholder — update when static template is ready */}
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

## Step 6 — Register in `editor.js`

Add to the block import list in alphabetical order:
```js
import './blocks/block-slug';
```

---

## Step 7 — PHP Class (server-rendered blocks only)

`app/Blocks/{ClassName}.php`

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

## Step 8 — Blade Template (server-rendered blocks only)

`resources/views/blocks/{folder}/index.blade.php`

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

## Step 9 — CSS (if needed)

`resources/styles/blocks/{folder}.css`

Only needed for things Tailwind cannot express: keyframe animations, complex selectors, CSS custom property fallbacks. Most blocks need no CSS file.

---

## Final Checklist

- [ ] `block.json` — all attributes from gathered requirements, `"render": "index"` only if server-rendered
- [ ] `index.js` — correct pattern; `InnerBlocksCleanupFilter` if InnerBlocks; `__experimentalLabel` if child block
- [ ] `edit.jsx` — controls match every gathered attribute; placeholder canvas preview
- [ ] `save.jsx` — placeholder structure; `useBlockProps.save()`; `null` guard (client-side only)
- [ ] `editor.js` — import in alphabetical order
- [ ] `app/Blocks/{ClassName}.php` — every attribute extracted with `?? default`; `wrapper_attributes` always present (server-rendered only)
- [ ] `resources/views/blocks/{folder}/index.blade.php` — skeleton structure with variables (server-rendered only)
- [ ] `resources/styles/blocks/{folder}.css` — only if needed
