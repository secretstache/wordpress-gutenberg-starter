---
name: migrate-static
description: Use this skill when a static React component exists for the block. Trigger phrases include "migrate static", "static is ready", "create block from static", "update block from static", "the static component exists", or when the user references a static/src/blocks/ path.
version: 2.0.0
---

# Migrate Static Skill

> If no static component exists yet, use `/register-block` instead — it gathers requirements from the user and creates placeholder files.

The static React component is the primary source of truth. Read it first — it defines the attributes, controls, and HTML structure. Then check which block files already exist, report the create-vs-update plan, and proceed.

---

## Step 0 — Check for Spec Entry in `docs/ui-breakdown.yml`

Before reading the static component, check whether a spec entry already exists from a previous `/prepare-editor-structure` run:

1. Check if `docs/ui-breakdown.yml` exists in the project root.
2. If it exists, look for a top-level key matching the block slug (e.g. `accordion:`, `blog-feed:`).
3. **If a spec entry is found:**
   - Use `controls` as the authoritative attribute/control plan — do not re-derive controls from TSX props.
   - Use `inner_blocks` (if present) to determine child block structure and attributes.
   - Use `data_source` (if present) to determine render strategy and query config.
   - Use `render` to determine whether this is `server-side`, `client-side`, or `innerblocks-parent`.
   - Check for `php_wrapper: true` — if present, the block needs both `"render":"index"` in block.json AND `save: () => <InnerBlocks.Content />`.
   - Check for `skip: true` — if present, stop immediately and inform the user this block is marked to skip.
   - Still read the TSX component (Step 0-B below), but **only for the HTML structure** to migrate to Blade — not for prop→control decisions.
   - Log: `"Found spec entry for ssm/{slug} in docs/ui-breakdown.yml — using YAML spec."`
4. **If no spec entry is found**, fall back to TSX-based inference (Step 0-B below — behavior unchanged).

---

## Step 0-B — Read the Static Component

**Primary source: Storybook MCP** (requires `yarn storybook` running from `/static`)

1. Call `mcp__storybook__list-all-documentation` to find the component ID.
2. Call `mcp__storybook__get-documentation` with that ID — this returns TypeScript props, story variants, and usage examples. Use as the authoritative prop list; never guess.
3. If Storybook is not running, fall back to reading the component directly at `static/src/blocks/custom/{BlockName}/{BlockName}.tsx`.

If the user didn't specify the block name, ask for it before proceeding.

The component has two parts to analyze:

### Part A — TypeScript interface (props declaration)

Props are declared as a TypeScript interface. Read all fields, their types, and union string literals:

```tsx
interface TeamMembersProps {
  heading: string;
  layout: 'top' | 'left';
  members: Member[];
  linkLabel: string;
}
```

### Part B — Component body (conditionals, loops, inline styles)

Read all `{condition && ...}`, `.map(...)`, and `style={{ }}` usages — these define the HTML structure to replicate in Blade.

---

## Step 1 — Map Props to Attributes and Controls

Apply these rules to every prop found in the static template:

### Attribute type mapping

| Static pattern | block.json attribute type | Default |
|---------------|--------------------------|---------|
| `string` union literal (`'opt1' \| 'opt2'`) | `"string"` + `"enum"` | first option |
| `string` free text (title, label, etc.) | `"string"` | `""` |
| `string` that is a color (`bg`, `color`, `backgroundColor`, etc.) | `"object"` → `{ "value": "...", "slug": "..." }` | theme primary |
| `boolean` | `"boolean"` | `false` |
| image/media object | `"object"` → `{ "id": null, "url": null, "alt": null }` | as shown |
| `number` | `"number"` | depends |
| `array` of simple data | `"array"` | `[]` |
| `array` of rich content items (`.map()` with complex JSX) | InnerBlocks child block | — |

### Control type mapping

| Attribute | Editor control |
|-----------|---------------|
| `boolean` | `<ToggleControl>` |
| `string` free text | `<TextControl>` |
| `string` HTML content | `<RichText>` in edit, `<RichText.Content>` in save |
| `string` enum with 2–4 options | `<ToggleGroupControl>` (use `__experimentalToggleGroupControl`) |
| `string` enum with 5+ options | `<RadioControl>` |
| `object {value, slug}` color | `<ColorPaletteControl>` from `@secretstache/wordpress-gutenberg` |
| `object {id, url, alt}` media | `<MediaControl>` from `@secretstache/wordpress-gutenberg` |
| `number` bounded | `<RangeControl>` with min/max/step |

**Boolean attribute naming:** Boolean TSX props must be prefixed with `is` in `block.json`. Rename if needed for clarity (e.g. TSX prop `openFirstOnLoad` → block attribute `isOpenedByDefault`).

### Render strategy decision

Answer these from the component:
- Does it receive a `members`, `posts`, or similar data array that comes from a CPT query? → **server-side**
- Does it call `get_field()`, `get_the_title()`, or similar WP functions? → **server-side**
- Does it have InnerBlocks children? → **server-side** (parent), **client-side** (child)
- Is it purely presentational with no DB data? → **client-side save**

---

## Step 2 — Plan the HTML Migration

Before writing any code, mentally map the React component to its target:

**Server-rendered → Blade template**

| React/JSX | Blade |
|-----------|-------|
| Root `<div className="wp-block-ssm-...">` | `<div {!! $wrapper_attributes !!}>` |
| `{text}` | `{{ $text }}` (escaped) |
| `{html}` / WP function output | `{!! $html !!}` (unescaped) |
| `{condition && <el>}` | `@if ($condition)` |
| `{x === 'value' && <el>}` | `@if ($x === 'value')` |
| `{items.map((item) => ...)}` | `@foreach ($items as $item)` |
| fallback `x ?? 'default'` | (handle in PHP `prepareData`, pass as variable) |
| `style={{ '--var': color }}` | `style="--var: {{ $color }}"` |
| `cn('cls', condition && 'cls2')` | `@class(['cls', 'cls2' => $condition])` |

**Client-side → `save.jsx`**

| React/JSX (edit) | save.jsx |
|------------------|---------|
| `{text}` | `{text}` |
| `{x && (...)}` | `{x && (...)}` |
| `{items.map(...)}` | `{items.map(...)}` |
| `style={{ '--var': color }}` | `style={{ '--var': color }}` |
| `<RichText>` in edit | `<RichText.Content tagName="p" value={quote} />` |

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
  "description": "",
  "keywords": ["keyword1", "keyword2", "ab"],
  "category": "ssm-components",
  "icon": "columns",
  "supports": {
    "anchor": true,
    "className": true,
    "spacing": { "margin": true, "padding": true }
  },
  "attributes": {}
}
```

Add `"render": "index"` for server-rendered blocks only.

**`"align"` in supports:** only add when the block needs full/wide alignment (e.g. `"align": ["full"]` for full-bleed, `"align": ["wide"]` for grid). Most blocks omit it.

**`"anchor"` and `"className"`** are included in every block by default — they enable the WordPress ID/anchor attribute and custom CSS class fields in the editor.

**Keywords:** add a 2–3-letter abbreviation as the last keyword (`"bf"` for blog-feed, `"tm"` for team-members).

**Icon:** use `"columns"` as the default for most blocks. Use `"list-view"` for list/accordion/timeline-style blocks. Use `"grid-view"` for cloud/gallery-style blocks.

Category: `"ssm-components"` for standalone blocks, `"ssm-templates"` for data-query/full-section blocks, `"ssm-design"` for root layout containers (section-wrapper).

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

**Server-rendered block (no InnerBlocks):**
```js
import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.jsx';
import blockMetadata from './block.json';

registerBlockType(blockMetadata, { edit, save: () => null });
```

**InnerBlocks block (plain container):**
```js
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import { edit } from './edit.jsx';
import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save: () => <InnerBlocks.Content />,
});
```

**InnerBlocks block with PHP wrapper** (e.g. a carousel needing server-side markup around the child items): add `"render": "index"` to block.json AND keep `save: () => <InnerBlocks.Content />`. The PHP template receives the serialized inner blocks as `$content`. Use this when the parent block needs PHP markup (like a Splide carousel div) wrapping the child content.

**Data-source block** — has `queryType` / posts / feed. No `save`, no `InnerBlocks`, no `InnerBlocksCleanupFilter`. Constants are typically defined locally in `edit.jsx`, not exported here:
```js
import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.jsx';
import blockMetadata from './block.json';

registerBlockType(blockMetadata, { edit });
```

If constants need to be shared with other files, export them here:
```js
export const POST_TYPE = { POST: 'post' };    // use actual CPT slug
export const QUERY_TYPE = { LATEST: 'latest', BY_CATEGORY: 'category', CURATED: 'curated' };
```

**Child block with custom List View label:**

For child blocks with URL + open-in-new-tab: store as separate attributes (`url: string`, `linkIsOpenInNewTab: boolean`) and use `__experimentalLinkControl`:
```jsx
import { RichText, __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { useCallback, useMemo } from '@wordpress/element';

// In edit component:
const linkValue = useMemo(() => ({ url, opensInNewTab: linkIsOpenInNewTab }), [url, linkIsOpenInNewTab]);
const onLinkChange = useCallback((link) => {
    setAttributes({ url: link?.url || '', linkIsOpenInNewTab: link?.opensInNewTab || false });
}, []);

<LinkControl
    value={linkValue}
    onChange={onLinkChange}
    onRemove={() => setAttributes({ url: '', linkIsOpenInNewTab: false })}
    settings={[{ id: 'opensInNewTab', title: 'Open in new tab', isToggle: true }]}
    showInitialSuggestions={true}
/>
```

In `save.jsx`, spread open-in-new-tab on the anchor:
```jsx
<a href={url || '#'} {...(linkIsOpenInNewTab && { target: '_blank', rel: 'noreferrer noopener' })}>
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

**Child block text props — use `RichText` inline in the canvas, not `TextControl` in the sidebar:**

```jsx
import { RichText } from '@wordpress/block-editor';

// In the canvas preview (NOT inside InspectorControls):
<RichText
    tagName="span"
    value={title}
    onChange={(title) => setAttributes({ title })}
    placeholder="Enter title..."
/>
```

Use `RichText` for any item-level text (title, label, description) in child blocks. Only use `TextControl` in the sidebar for block-level global settings (e.g. a shared heading above a grid).

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

Define `POST_TYPE`, `QUERY_TYPE`, and `TAXONOMY` constants locally at the top of `edit.jsx`. They do not need to be exported from `index.jsx` unless another file needs to import them:

```jsx
import { useMemo } from '@wordpress/element';
import {
    ResourcesWrapper,
    DataQueryControls,
    useDataQuery,
} from '@secretstache/wordpress-gutenberg';

const TAXONOMY = { CATEGORY: 'category' };

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

Migrate the HTML from the static component to JSX. Follow the mapping from Step 2.

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
- **Before writing any transformation logic** (chunking, splitting, parsing `$content`): check the static component's render body. If the component doesn't do it, PHP shouldn't either. `prepareData` should mirror what the static component does — if it just maps props to markup, keep PHP equally simple.

**Data-query block pattern** (CPT/taxonomy blocks — always use this exact structure):

```php
<?php

namespace App\Blocks;

use App\View\Composers\SSM;   // always import SSM for data-query blocks

class BlogFeed extends Block
{
    public const QUERY_LATEST      = 'latest';    // define all query type constants
    public const QUERY_CURATED     = 'curated';
    public const QUERY_BY_CATEGORY = 'category';

    protected function prepareData($attributes, $content): array
    {
        $query         = $attributes['queryType']     ?? self::QUERY_LATEST;
        $number_posts  = $attributes['numberOfPosts'] ?? 3;
        $curated_posts = array_column($attributes['curatedPosts'] ?? [], 'value');
        $curated_terms = array_column($attributes['curatedTerms'] ?? [], 'value');

        $is_empty_selection = ($query === self::QUERY_CURATED && empty($curated_posts))
                           || ($query === self::QUERY_BY_CATEGORY && empty($curated_terms));

        $args = [
            'data_source'    => 'posts',             // CPT slug (not WP post_type key)
            'query'          => $query,
            'taxonomy_slug'  => 'category',
            'curated_terms'  => $curated_terms,
            'number_posts'   => $query === self::QUERY_CURATED ? -1 : $number_posts,
            'curated_posts'  => $curated_posts,
            'excluded_posts' => [get_the_ID()],      // always exclude current page
        ];
        $post_ids = $is_empty_selection ? [] : SSM::getPosts($args);

        $posts = array_map(function ($post_id) {
            $image = null;
            if (has_post_thumbnail($post_id)) {
                $thumbnail_id = get_post_thumbnail_id($post_id);
                $image = [
                    'url' => get_the_post_thumbnail_url($post_id, 'large'),
                    'id'  => $thumbnail_id,
                    'alt' => get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true)
                             ?: get_the_title($post_id),
                ];
            }

            return [
                'id'         => $post_id,
                'title'      => get_the_title($post_id),
                'excerpt'    => SSM::getPostExcerpt($post_id),  // use SSM helper, not get_the_excerpt()
                'image'      => $image,
                'link'       => get_permalink($post_id),
                'link_label' => 'Read Article',                 // hardcoded per project convention
            ];
        }, $post_ids);

        $wrapper_attributes = get_block_wrapper_attributes();

        return [
            'wrapper_attributes' => $wrapper_attributes,
            'posts'              => $posts,
        ];
    }
}
```

Key points:
- Always `use App\View\Composers\SSM;` — never use bare `get_posts()`.
- Define `QUERY_*` constants on the class (matches the exported constants in `index.jsx`).
- `'data_source'` must be the CPT slug (e.g. `'posts'`, `'frh_team'`).
- Always include `'excluded_posts' => [get_the_ID()]` to exclude the current page.
- Thumbnail: always guard with `has_post_thumbnail()`, fetch alt from post meta with title fallback.
- Use `SSM::getPostExcerpt($post_id)` — not native `get_the_excerpt()`.

---

## Step 11 — Blade Template (server-rendered blocks only)

`resources/views/blocks/{folder}/index.blade.php`

Migrate the HTML from the static component to Blade using the mapping from Step 2.

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

**Responsive images — always use `ipq_get_theme_image()` with fallback:**

```blade
@if ($post['image'])
    @if (function_exists('ipq_get_theme_image'))
        {!! ipq_get_theme_image(
            $post['image']['id'],
            [ [550, 300, true], [1100, 600, true], [2200, 1200, true] ],
            ['alt' => $post['image']['alt'], 'class' => 'w-full h-full object-cover']
        ) !!}
    @else
        <img src="{!! $post['image']['url'] !!}" alt="{!! $post['image']['alt'] !!}" class="w-full h-full object-cover" />
    @endif
@endif
```

Adjust the responsive size pairs (`[width, height, crop]`) to match the actual display size.

---

## Step 12 — CSS (if needed)

`resources/styles/blocks/{folder}.css`

Only needed for things Tailwind cannot express: keyframe animations, complex selectors, CSS custom property fallbacks. Most blocks need no CSS file.

If a CSS file is created, add its `@import` to **both**:
- `resources/styles/app.css` (frontend)
- `resources/styles/editor-canvas.css` (editor) — in the `/* custom blocks */` section

Skipping `editor-canvas.css` means all block styles, including `:root` CSS variables, are absent from the editor canvas.

---

## Final Checklist

- [ ] Static template read and all props mapped to attributes/controls
- [ ] Existing files scanned; create-vs-update plan reported and confirmed by user
- [ ] `block.json` — all attributes match the static props, `"render": "index"` only if server-rendered
- [ ] `index.js` — correct pattern; `save: () => <InnerBlocks.Content />` for InnerBlocks blocks; `__experimentalLabel` if child block
- [ ] `edit.jsx` — controls match every configurable prop; canvas preview mirrors static structure; `ColorPaletteControl` uses `value={color?.value}`
- [ ] `save.jsx` — HTML migrated from static template; `useBlockProps.save()`; `null` guard (client-side only)
- [ ] `editor.js` — import in alphabetical order (skip if already present)
- [ ] `app/Blocks/{ClassName}.php` — every attribute extracted with `?? default`; `wrapper_attributes` always present (server-rendered only)
- [ ] `resources/views/blocks/{folder}/index.blade.php` — HTML migrated from static template (server-rendered only)
- [ ] `resources/styles/blocks/{folder}.css` — only if needed
