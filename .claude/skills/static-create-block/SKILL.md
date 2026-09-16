---
name: static-create-block
description: Use this skill to create a new React block component or update an existing one in the static/ library. Trigger phrases include "create a static block", "add a static component", "new static block called", "add a block to static", "update block", "style core block", or when the user wants a new or updated React component in static/src/blocks/.
version: 3.0.0
---

# Static Create / Update Block Skill

This skill **creates new custom blocks** or **updates existing blocks** (custom or core) based on a Figma design, image, or user description.

---

## Block Location Rules

| Block type | Location | Can create new? | Can update? | Styling approach |
|------------|----------|----------------|-------------|-----------------|
| **Custom** | `static/src/blocks/custom/` | Yes | Yes | Tailwind classes in TSX; CSS file if Tailwind is insufficient |
| **Core** | `static/src/blocks/core/` | **No** | Yes — existing only | `resources/styles/blocks/{block}.css` only — no inline Tailwind on core block elements, no HTML/prop changes |

**Never create a new file inside `static/src/blocks/core/`.** Core blocks are WordPress-managed — you can only add or change CSS styles for existing ones.

---

## Step 0 — Gather Requirements and Resolve Intent

Ask the user for:

1. **Block name** — PascalCase component name (e.g. `PromoCard`) or core block name (e.g. `Button`, `Heading`)
2. **Figma link or image** — optional; if provided, fetch via Figma MCP tool or read the image
3. **Additional context** — constraints, variants, or behaviour notes

Then, before planning anything:

### A — Determine if the block is core or custom

- If the name matches a file in `static/src/blocks/core/` (e.g. `Button`, `Heading`, `Image`) → it is a **core block**
- Otherwise → it is a **custom block**

### B — Check whether the block already exists

**For custom blocks:** check `static/src/blocks/custom/` for a folder matching the block name (case-insensitive, kebab-case).

- If it **does not exist** → proceed to create it (Steps 1–7 below)
- If it **already exists** and the user asked to "create" it → ask:
  > A block called `{BlockName}` already exists. Do you want to **update it** or **create a new block with a different name**?
  - If **update** → proceed as an update (modify existing files rather than creating new ones)
  - If **new name** → ask the user to choose a different name, then restart from Step 0

**For core blocks:** check `static/src/blocks/core/` for an existing file.

- If it **exists** → proceed to core block styling (Step 0C below)
- If it **does not exist** → inform the user:
  > Core block `{BlockName}` doesn't exist in this project yet. Only existing core blocks can be styled here — new core blocks cannot be created. Check `static/src/blocks/core/` for available blocks.

### C — Core block path (styling only)

If the block is a core block, **skip Steps 1–5 entirely**. Do only this:

1. Read the existing component in `static/src/blocks/core/` to understand its BEM class structure
2. Read `resources/styles/blocks/{block}.css` if it already exists
3. Fetch the Figma design or read the image to understand required styles
4. Plan the CSS changes — **only `resources/styles/blocks/{block}.css`**; no HTML, no props, no Tailwind classes in TSX
5. For custom style variants, use `.is-style-{name}` class selectors
6. Present the plan, wait for confirmation, then write the CSS
7. If the file is new, import it in `resources/styles/app.css` and `resources/styles/editor-canvas.css`

Go directly to the Final Checklist after writing.

---

## Step 1 — Analyse the Design and Plan Props

*(Custom blocks only)*

### If a Figma link or image was provided

Fetch the design via the Figma MCP tool, or read the image. From the design, determine:

- What **content** the block needs to display (text fields, images, icons, links, lists)

#### Image assets — always do this when a Figma design is provided

After fetching the design context, identify all photo/image asset URLs returned (constants named `imgPropertyImage*`, `imgPhoto*`, `imgHero*`, etc. — skip SVG icons and vectors). For each one:

1. `curl -sL <url> -o <name>.tmp` — download the asset
2. `cwebp -q 80 <name>.tmp -o <name>.webp` — convert to WebP at quality 80
3. Save to `resources/images/cms/` and delete the `.tmp` file
4. Reference as `assets/images/cms/<name>.webp` in Storybook stories

Use descriptive file names based on content (e.g. `gallery-exterior-1.webp`, `hero-living-room.webp`).
- What **visual variants** exist (size, style, alignment, colour scheme)
- Whether the block is a **layout container** that wraps other content (→ needs `children`)
- Whether any behaviour requires **client-side JavaScript** (carousels, scroll triggers, third-party embeds). Don't use React-specific JS — this is a static view of a WordPress block.

### If no design was provided

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

Spacing is resolved via `getSpacingProps()` from `@lib/block-props`. `align` is resolved via `getAlignClass({ align })`.

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

Read `resources/styles/settings/theme.css` and `theme.json` to know what tokens are available. Cross-reference every visual value from the design against the theme.

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

1. Add the CSS variable to `resources/styles/settings/theme.css` inside the `@theme` block (colors, fonts, text sizes) or `:root` (one-off tokens).
2. If it is a color, font family, or font size that should be selectable in the block editor, also add it to `theme.json`.
3. Document the new token in the plan.

Do **not** use arbitrary Tailwind values (e.g. `text-[17px]`, `bg-[#e5e5e5]`) — always define a token first.

---

## Step 2 — Present the Plan

*(Custom blocks only)*

Before writing any files, present a plan and wait for confirmation.

The plan must include:

**1. New theme tokens** (if any design values are missing from the theme):
```
ADD TO resources/styles/settings/theme.css:
  --color-navy: #1a2b4c;      → also add to theme.json palette

ADD TO theme.json only:
  (none)
```
If nothing is missing, write "No new tokens needed."

**2. Proposed props interface** (exclude spacing, `className`, `id`, `align` — always present):
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

**3. Files to create or update:**
```
CREATE / UPDATE:
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

Group props with inline comments. All props are optional (`?:`) unless a meaningful fallback is impossible.

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

**Build the complete, working component.** Do not leave placeholder comments or empty sections — implement the full HTML structure derived from the design or description.

Structure rules:
- Root element gets the BEM root class (`wp-block-ssm-{folder}`), `getAlignClass`, spacing styles, `className`, and `id`
- Every meaningful child element gets a BEM class (`wp-block-ssm-{folder}__{element}`)
- Use Tailwind utility classes for all visual styling — colours, typography, layout, spacing — sourced from theme tokens only (no arbitrary values)
- Conditional rendering: `{prop && <el>...</el>}` for optional content, never render empty elements
- Images: always use `url()` from `@lib/url` for `src`

**No React state (`useState`, `useReducer`, etc.)** — Static block components render as plain HTML in WordPress with no React runtime. Any interactive state (open/closed, active tab, current slide) must be managed by the client JS (`Component` class in `resources/scripts/client/blocks/`), which adds/removes CSS classes on the element. Use Tailwind's `group-[&.is-open]/name` or `[&.is-active]` arbitrary variant selectors to style those states purely in the TSX markup — no `useState` needed.

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
| Raw pixel values in inline styles | Wrap in `rem()` — e.g. `{ fontSize: 'rem(14)' }`. Never use bare `px` values. |

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

- Always use `cx()` (from `@lib/block-props`) for block element classNames.
- Use `cn()` (from `@lib/cn`) only inside UI sub-components that are not block elements.
- `getColorProps`, `getBorderProps`, etc. are only needed when the block exposes WP preset-slug props.
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

**Custom blocks:** create only when Tailwind cannot express the requirement — keyframe animations, complex `:has()` / `:nth-child()` selectors, CSS custom property fallbacks, or third-party overrides.

**Core blocks:** always use a CSS file here — never inline Tailwind in the core TSX file. Custom style variants use `.is-style-{name}` selectors.

```css
/* resources/styles/blocks/button.css */
.wp-block-button { /* ... */ }
.wp-block-button.is-style-outline { /* ... */ }
```

Import the file in `resources/styles/app.css` and `resources/styles/editor-canvas.css`.

### CSS authoring rules — always follow these

| Rule | Details |
|------|---------|
| **No raw pixels** | Wrap every pixel value in `rem()` — e.g. `rem(14)` not `14px`. This is a custom PostCSS function available throughout the project. |
| **Tailwind v4 via `@apply`** | Default to `@apply` with Tailwind v4 utilities. Fall back to plain CSS only when no utility maps cleanly (e.g. custom aspect ratios, `calc()` expressions using CSS variables). |
| **Transitions** | Always use Tailwind transition utilities (`transition-colors`, `transition-all`, etc.) via `@apply`. Never write a plain `transition:` declaration. |
| **Dark background — always required** | Every interactive element (buttons, arrows, links, icons, form controls) **must** have dark-mode styles. Use the `* { @variant dark { .selector { ... } } }` pattern at the end of the CSS file. The `dark` variant is defined in `resources/styles/settings/variant.css` as `.bg-dark` on body/ancestor. Typical mapping: borders/text `dark-blue → white`; hover fill `dark-blue → white` with text inverting to `dark-blue`. See `button.css` for the reference implementation. |

---

## Step 7 — Client JavaScript (only if needed)

`resources/scripts/client/blocks/{block-name}.js`

Create **only** when the block needs JavaScript in the WordPress theme — e.g. carousel initialisation, scroll triggers, native browser APIs, or third-party embed scripts.

Do **not** add client JS for hover states, show/hide, or simple class toggles — use Tailwind + CSS for those.

### Pattern — extend `Component`

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

Add a dynamic import inside `initComponents()` in `resources/scripts/client/app.js`:

```js
const {blockName}Els = [...document.querySelectorAll('.wp-block-ssm-{folder}')];

// inside the Promise.all array:
{blockName}Els.length && import('./blocks/{block-name}.js').then(({ {BlockName} }) => {blockName}Els.map((el) => {BlockName}.getOrCreate(el))),
```

---

## Final Checklist

**All blocks:**
- [ ] Determined whether block is core or custom
- [ ] Checked if block already exists; if so, asked user to update or rename before proceeding
- [ ] Never created a new file inside `static/src/blocks/core/`

**Core blocks only:**
- [ ] Read existing core component to understand BEM class structure
- [ ] All styling in `resources/styles/blocks/{block}.css` only — no Tailwind classes added to core TSX, no HTML or prop changes
- [ ] Custom variants use `.is-style-{name}` selectors
- [ ] CSS file imported in `app.css` and `editor-canvas.css` if new

**Custom blocks only:**
- [ ] `resources/styles/settings/theme.css` + `theme.json` — missing tokens added before writing the component
- [ ] Plan (tokens, props, files) presented to user and confirmed before writing
- [ ] `{BlockName}.tsx` — full working implementation; no placeholder comments; BEM classes on all elements; only theme tokens used (no arbitrary Tailwind values); flat spacing props + `getSpacingProps()`; `align` + `getAlignClass()`; `className` and `id` always present; named + default export
- [ ] `{BlockName}.stories.tsx` — `paddingArgTypes` + `marginArgTypes` + `align` argType spread in; at least `Default` story with realistic args; `children` hidden from controls panel
- [ ] `index.ts` — single-line named re-export
- [ ] `resources/styles/blocks/{folder}.css` — only if Tailwind is insufficient; imported in `app.css` and `editor-canvas.css`
- [ ] `resources/scripts/client/blocks/{folder}.js` — only if interactive JS is needed; extends `Component`, registered in `app.js` via dynamic import + `getOrCreate()`
- [ ] **Dark background** — every interactive element has a `* { @variant dark { ... } }` block; colours invert correctly against `.bg-dark`
- [ ] No React state (`useState`, `useReducer`, etc.) is used
