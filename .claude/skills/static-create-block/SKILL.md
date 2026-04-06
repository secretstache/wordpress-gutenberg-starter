---
name: static-create-block
description: Use this skill to create a new React block component in the static/ library. Trigger phrases include "create a static block", "add a static component", "new static block called", "add a block to static", or when the user wants a new React component in static/src/blocks/.
version: 2.0.0
---

# Static Create Block Skill

> This skill creates files only inside `/static/src/blocks/`. All blocks created here are `custom` blocks.

Create the three files that make up a static block: the TSX component, the Storybook stories file, and the index re-export. Analyse the design first, propose a plan, wait for confirmation, then write.

---

## Step 0 — Gather Requirements

Ask the user for **only** these three things:

1. **Block name** — PascalCase component name (e.g. `PromoCard`)
2. **Figma design link** — optional; if provided, fetch it via the Figma MCP tool
3. **Additional information** — any constraints, special behaviour, or context the user wants to share

Do **not** ask about props, children, CSS, or JavaScript — those are determined by you in Step 1.

---

## Step 1 — Analyse the Design and Plan Props

### If a Figma link was provided

Fetch the design via the Figma MCP tool. From the design, determine:

- What **content** the block needs to display (text fields, images, icons, links, lists)
- What **visual variants** exist (size, style, alignment, colour scheme)
- Whether the block is a **layout container** that wraps other content (→ needs `children`)
- Whether any behaviour requires **client-side JavaScript** (carousels, scroll triggers, third-party embeds, etc.). Don't use specific React javascript, because this is just a static version of wordpress block.

### If no Figma link was provided

Use the block name and any additional information given to infer a sensible default prop set.

### Common props — always included

Every custom block receives these props automatically. Do **not** ask the user about them:

```ts
// Spacing — WP preset slug (e.g. 'var:preset|spacing|40') or raw CSS value
paddingTop?: string;
paddingBottom?: string;
paddingLeft?: string;
paddingRight?: string;
marginTop?: string;
marginBottom?: string;
// Layout
align?: 'wide' | 'full';
// Block
className?: string;
id?: string;
```

Spacing is resolved via `getSpacingProps()` from `@lib/block-props`. `align` is resolved via `getAlignClass({ align })`, which produces `alignwide`, `alignfull`, etc. All other props are block-specific and derived from the design.

### Prop type rules

| Pattern | TypeScript type |
|---------|----------------|
| Free text / HTML | `string` |
| Enum (2–4 options) | Union: `'default' \| 'large' \| 'full'` |
| Boolean toggle | `boolean` |
| Image / media | `{ id?: number \| null; url?: string \| null; alt?: string \| null }` |
| Nested config object | Named sub-interface (e.g. `PromoCardBg`) |
| Theme color slug | `string` (resolved via `darkBackground` or directly as a Tailwind class) |

### Design Token Audit — always do this before planning

Read `resources/styles/settings/theme.css` and `theme.json` to know what tokens are available. Then cross-reference every visual value from the design against the theme.

**Available token categories:**

| Category | CSS variable | Tailwind class | theme.json |
|----------|-------------|---------------|------------|
| Colors | `--color-{name}` | `bg-{name}`, `text-{name}` | `settings.color.palette` |
| Font families | `--font-{family}` | `font-{family}` | `settings.typography.fontFamilies` |
| Font sizes | `--text-{size}` | `text-{size}` | `settings.typography.fontSizes` |
| SSM spacing | `--spacing-ssm-{n}` | `pt-ssm-{n}`, `mt-ssm-{n}`, etc. | — |
| WP spacing (for block editor) | `--wp--preset--spacing--{slug}` | — | `settings.spacing.spacingSizes` |
| Containers | `--container-default`, `--container-wide` | `max-w-[var(--container-default)]` | — |

**If a value from the design is missing from the theme files:**

1. Add the CSS variable to `resources/styles/settings/theme.css` inside the `@theme` block (for colors, fonts, text sizes) or `:root` (for one-off tokens).
2. If it is a color, font family, or font size that should be selectable in the WordPress block editor, also add it to the relevant array in `theme.json`.
3. Document the new token in the plan so the user can see it.

Do **not** use arbitrary Tailwind values (e.g. `text-[17px]`, `bg-[#e5e5e5]`) — always define a token first.

---

## Step 2 — Present the Plan

Before writing any files, present a plan to the user and wait for confirmation.

The plan must include:

**1. New theme tokens** (if any Figma values are missing from the theme — list each one):
```
ADD TO resources/styles/settings/theme.css:
  --color-navy: #1a2b4c;      → also add to theme.json palette

ADD TO theme.json only:
  (none)
```
If nothing is missing, write "No new tokens needed."

**2. Proposed props interface** (exclude spacing, `className`, `id`, `align` — those are always present):
```
PromoCard custom props:
  title?: string           // Card heading
  body?: string            // Supporting text
  image?: { url, alt }     // Card image
  ctaLabel?: string        // Button label
  ctaUrl?: string          // Button link
  size?: 'default' | 'large'
  children?: React.ReactNode  // yes / no
```

**3. Files to create:**
```
CREATE:
  • static/src/blocks/custom/promo-card/PromoCard.tsx
  • static/src/blocks/custom/promo-card/PromoCard.stories.tsx
  • static/src/blocks/custom/promo-card/index.ts

ALSO CREATE (if needed):
  • resources/styles/blocks/promo-card.css   — [reason, or "not needed"]
  • resources/scripts/client/blocks/promo-card.js   — [reason, or "not needed"]
```

Wait for the user to confirm or adjust before writing anything.

---

## Step 3 — `{BlockName}.tsx`

`static/src/blocks/custom/{folder}/{BlockName}.tsx`

### Props interface

Group props with inline comments. All props are optional (`?:`) unless a meaningful fallback is impossible (e.g. `children` on a layout wrapper).

```tsx
export interface {BlockName}Props {
    // Content
    title?: string;
    // ... block-specific props ...
    // Spacing — WP preset slug (e.g. 'var:preset|spacing|40') or raw CSS value
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    marginTop?: string;
    marginBottom?: string;
    // Layout
    align?: 'wide' | 'full';
    // Block
    className?: string;
    id?: string;
    // Children (include only if the block is a layout container)
    children?: React.ReactNode;
}
```

### Component body

**Build the complete, working component.** Do not leave placeholder comments or empty sections — implement the full HTML structure derived from the Figma design or user description.

Structure rules:
- Root element gets the BEM root class (`wp-block-ssm-{folder}`), `getAlignClass`, spacing styles, `className`, and `id`
- Every meaningful child element gets a BEM class (`wp-block-ssm-{folder}__{element}`)
- Use Tailwind utility classes for all visual styling — colours, typography, layout, spacing — sourced from theme tokens only (no arbitrary values)
- Conditional rendering: `{prop && <el>...</el>}` for optional content, never render empty elements
- Images: always use `url()` from `@lib/url` for `src`

```tsx
export const {BlockName} = ({
    title,
    body,
    image,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
    align,
    className,
    id,
    children,
}: {BlockName}Props) => {
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom });

    const wrapperClass = cx(
        'wp-block-ssm-{folder}',
        getAlignClass({ align }),
        className,
    );

    const wrapperStyle = { ...spacingProps.style };

    return (
        <div className={wrapperClass} style={wrapperStyle} id={id}>
            {image?.url && (
                <img
                    className="wp-block-ssm-{folder}__image"
                    src={url(image.url)}
                    alt={image.alt ?? ''}
                />
            )}
            {title && (
                <h2 className="wp-block-ssm-{folder}__title font-sans-serif text-2xl text-black">
                    {title}
                </h2>
            )}
            {body && (
                <p className="wp-block-ssm-{folder}__body text-md text-black">
                    {body}
                </p>
            )}
            {children}
        </div>
    );
};

export default {BlockName};
```

**Styling guide — use theme tokens, never arbitrary values:**

| Design value | How to apply |
|-------------|-------------|
| A colour from the theme palette | Tailwind class: `text-black`, `bg-white`, `border-navy` |
| A font from the theme | Tailwind class: `font-sans-serif`, `font-serif` |
| A text size from the theme | Tailwind class: `text-3xl`, `text-md`, `text-sm` |
| SSM spacing (section-level) | Tailwind class: `pt-ssm-3`, `mt-ssm-1` |
| WP block editor spacing | Pass as prop → `getSpacingProps()` → inline style |
| A colour/font/size NOT in the theme | Add it to `theme.css` (and `theme.json` if editor-selectable) first, then use the token |

### Import reference

| Need | Import |
|------|--------|
| Class composition | `import { cx } from '@lib/block-props';` |
| WP color / border / typography helpers | `import { getColorProps, getBorderProps, getSpacingProps, getTypographyProps } from '@lib/block-props';` |
| Theme palette / font data | `import { palette, colorLabels, resolveSpacing } from '@lib/theme';` |
| URL resolution | `import { url } from '@lib/url';` |
| Minimal className utility (UI sub-components only) | `import { cn } from '@lib/cn';` |
| Scoped CSS injection (complex layouts) | `import { useId } from 'react';` |
| Dark background detection | `import { darkBackground } from '@shared/backgrounds.js';` |

### Key rules

- Always use `cx()` (from `@lib/block-props`) for block element classNames — it returns `undefined` on empty, keeping the DOM clean.
- Use `cn()` (from `@lib/cn`) only inside UI sub-components that are not block elements.
- `getColorProps`, `getBorderProps`, etc. are only needed when the block exposes WP preset-slug props. Most custom blocks do not need them — use Tailwind classes directly.
- Export both a named export and `export default`.

---

## Step 4 — `{BlockName}.stories.tsx`

`static/src/blocks/custom/{folder}/{BlockName}.stories.tsx`

### Standard shape (Storybook 8+)

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { {BlockName} } from './{BlockName}';
import { paddingArgTypes, marginArgTypes, blockArgTypes } from '@lib/storybook-helpers';

const meta: Meta<typeof {BlockName}> = {
    title: 'Blocks/Custom/{BlockName}',
    component: {BlockName},
    tags: ['autodocs'],
    argTypes: {
        // — block-specific argTypes here —

        // Layout
        align: {
            control: 'select',
            options: ['wide', 'full'],
            description: 'Block alignment → alignwide / alignfull',
            table: { category: 'Layout' },
        },

        // Spacing
        ...paddingArgTypes,
        ...marginArgTypes,

        // Block
        ...blockArgTypes,

        // Hide children from controls panel
        children: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof {BlockName}>;

export const Default: Story = {
    args: { /* minimal realistic args */ },
};
```

Spacing props are flat strings on the component (`paddingTop`, `marginBottom`, etc.) — no `buildProps` helper needed.

### Custom argType patterns

| Prop kind | argType pattern |
|-----------|----------------|
| String enum | `control: { type: 'select' }, options: ['default', 'large']` |
| Color slug | `control: { type: 'select', labels: colorLabels }, options: colorSlugs` |
| Boolean | `control: 'boolean'` |
| Text | `control: 'text'` |
| Image URL | `control: 'text'` + description noting it expects a path |
| Range (opacity, etc.) | `control: { type: 'range', min: 0, max: 100, step: 5 }` |

### Story naming

- `Default` — minimal args, base appearance
- `{Variant}` — one key difference per story (e.g. `WithImage`, `LargeSize`, `DarkBackground`)

---

## Step 5 — `index.ts`

`static/src/blocks/custom/{folder}/index.ts`

```ts
export { {BlockName} } from './{BlockName}';
```

---

## Step 6 — CSS (only if needed)

`resources/styles/blocks/{folder}.css`

Create **only** when Tailwind cannot express the requirement: keyframe animations, complex `:has()` / `:nth-child()` selectors, CSS custom property fallbacks used across multiple elements, or third-party overrides.

```css
/* resources/styles/blocks/promo-card.css */
.wp-block-ssm-promo-card { /* ... */ }
```
---

Import the created file to `resources/styles/blocks/app.css` and `resources/styles/blocks/editor-canvas.css`

## Step 7 — Client JavaScript (only if needed)

`resources/scripts/client/blocks/{block-name}.js`

Create **only** when the block needs JavaScript beyond React in the WordPress theme — e.g. carousel initialisation, scroll triggers, native browser APIs, or third-party embed scripts.

Do **not** add client JS for hover states, show/hide, or simple class toggles — use Tailwind + CSS for those.

### Pattern — extend `Component`

All interactive blocks follow the same pattern as `resources/scripts/client/blocks/video.js`: extend the `Component` base class from `../utils/component.js`.

```js
// resources/scripts/client/blocks/{block-name}.js
import { Component } from '../utils/component.js';

export class {BlockName} extends Component {
    constructor(element, options = {}) {
        super(element, options);

        // initialise third-party library or browser API here
        // use this.on(el, 'event', handler) for tracked listeners
        // call this.destroy() early if the element is not usable
    }

    destroy() {
        // clean up library instances, observers, timers
        super.destroy();
    }
}
```

`Component` provides:
- `this.el` — the root element
- `this.on(el, type, handler)` — tracked listeners, auto-removed on `destroy()`
- `this.emit(type, detail)` — dispatches a bubbling `CustomEvent` on `this.el`
- `this._afterTransition(el, callback)` — fires after a CSS transition completes
- `static getInstance(el)` / `static getOrCreate(el, options)` — instance registry via WeakMap

### Register in `app.js`

Add a dynamic import inside `initComponents()` in `resources/scripts/client/app.js`, following the same pattern as the existing block entries:

```js
// query elements
const {blockName}Els = [...document.querySelectorAll('.wp-block-ssm-{folder}')];

// inside the Promise.all array:
{blockName}Els.length && import('./blocks/{block-name}.js').then(({ {BlockName} }) => {blockName}Els.map((el) => {BlockName}.getOrCreate(el))),
```

---

## Final Checklist

- [ ] `resources/styles/settings/theme.css` + `theme.json` — any missing tokens added before writing the component
- [ ] Plan (tokens, props, files) presented to user and confirmed before writing
- [ ] `{BlockName}.tsx` — full working implementation from the design; no placeholder comments; BEM classes on all elements; only theme tokens used (no arbitrary Tailwind values); flat spacing props + `getSpacingProps()`; `align` + `getAlignClass()`; `className` and `id` always present; named + default export
- [ ] `{BlockName}.stories.tsx` — `paddingArgTypes` + `marginArgTypes` + `align` argType spread in; at least `Default` story with realistic args; `children` hidden from controls panel
- [ ] `index.ts` — single-line named re-export
- [ ] `resources/styles/blocks/{folder}.css` — only if Tailwind is insufficient; imported in `app.css` and `editor-canvas.css`
- [ ] `resources/scripts/client/blocks/{folder}.js` — only if interactive JS is needed; extends `Component`, registered in `app.js` via dynamic import + `getOrCreate()`
