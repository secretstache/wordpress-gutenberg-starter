---
name: create-design-tokens
description: Use this skill when the user wants to extract design tokens from Figma and add them to the project theme files. Trigger phrases include "extract design tokens", "add tokens from Figma", "sync tokens", "add colors from Figma", "set up design tokens", "import Figma styles".
version: 1.0.0
---

# Create Design Tokens Skill

Extract colors, fonts, text sizes, and spacing values from Figma and add them to the two theme files that drive the entire project:

- `resources/styles/settings/theme.css` — Tailwind v4 `@theme` block; source of truth for CSS variables
- `theme.json` — WordPress block editor settings; controls what the editor exposes to content editors

---

## Step 0 — Gather Requirements

Ask the user for:

1. **Figma link(s)** — one or more frames, pages, or file links that contain the design system / style guide
2. **Additional context** — anything specific to extract (e.g. "only colours", "ignore spacing", "this project uses a custom scale")

---

## Step 1 — Read the Existing Theme Files

Before fetching Figma, read both files to understand what tokens already exist:

- `resources/styles/settings/theme.css`
- `theme.json`

Also read `shared/backgrounds.js` — it lists colour slugs that should be treated as dark backgrounds (used by `darkBackground` in component logic).

Build a mental map of:
- Which colour slugs are already defined
- Which font families are already defined
- Which font-size slugs are already defined
- Which spacing values exist

---

## Step 1.5 — Understand Protected and Adjustable Tokens

Before planning any changes, understand which tokens are **fixed in structure** (must always exist) vs. **adjustable** (values can be replaced to match the design).

### Colors — always keep `black` and `white`

`--color-black` and `--color-white` must always remain in both `theme.css` and `theme.json`. All other colour tokens can be added, removed, or replaced to match the design.

### Font sizes — always use `customClamp(minPx, maxPx)` for fluid type

Every `--text-{slug}` should use the `customClamp()` helper, which generates a fluid `clamp()` value between a minimum (mobile) and maximum (desktop) pixel size. Both values are in **px** — the function handles the unit conversion internally.

```css
--text-xl: customClamp(24, 40);   /* 24px on mobile → 40px on desktop */
```

Derive `min` and `max` from the Figma design: use the mobile frame size as `min` and the desktop frame size as `max`. If only one size is specified in Figma, use it for both values.

### Spacing — required tokens (values are adjustable)

These tokens must **always exist** — never remove them. Their values should be updated to reflect the design:

| Token | Purpose | Location |
|-------|---------|---------|
| `--spacing-container-padding` | Horizontal padding between the page edge and content | `@theme` in `theme.css` |
| `--spacing-column` | Gap between Gutenberg columns | `@theme` in `theme.css` |
| `--spacing-block` | Default vertical gap between blocks (also used as `blockGap` in `theme.json`) | `@theme` in `theme.css` + `styles.spacing.blockGap` in `theme.json` |
| `--spacing-ssm-0` through `--spacing-ssm-6` | Vertical rhythm scale for spacing **between sections** on a page | `@theme` in `theme.css` |

The `--spacing-ssm-{n}` scale (0–6) is the primary spacing tool for section-level layout. In this project's architecture, the top-level block on every page is always `SectionWrapper` — all other blocks live inside it. The `ssm` spacing scale controls the margin and padding of those wrappers and must cover the full range from 0 to the largest section gap in the design.

**Do not remove `--spacing-ssm-0` through `--spacing-ssm-6`** — the SectionWrapper component and content editor both depend on all seven values being present.

---

## Step 2 — Fetch the Figma Design

Fetch each Figma link via the Figma MCP tool. Extract:

### Colors
- All named colour styles (fills, strokes)
- For each: name → slug (kebab-case) → hex/rgba value
- Note which colours are "dark" (dark backgrounds requiring light text — typically near-black, dark navy, dark grey)

### Typography
- All named text styles
- Font families used
- Font size scale (map to a named scale: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, or add new slugs if the scale differs). Derive `customClamp(min, max)` values from mobile and desktop frame sizes.
- Font weights (note these — they're applied via Tailwind utilities, not theme tokens, unless a custom weight is needed)

### Spacing
- `--spacing-container-padding` — measure the horizontal margin from page edge to content in the design
- `--spacing-column` — measure the gap between columns in multi-column layouts
- `--spacing-block` — measure the default vertical gap between blocks
- `--spacing-ssm-{0–6}` — identify the section spacing scale: the set of vertical gaps used between major page sections. Map these to the 0–6 scale (0 = no gap, 6 = largest gap). If the design uses more or fewer than 6 non-zero values, distribute them across the scale keeping 0 = zero.

### Other tokens
- Any other named styles: border radii, shadows, etc. — add to `:root` in `theme.css` as custom properties if they'll be reused

---

## Step 3 — Cross-Reference and Plan

Compare Figma tokens against existing theme tokens.

Categorise each extracted token as:

| Status | Meaning |
|--------|---------|
| **exists** | Already in `theme.css` with matching value — skip |
| **update** | Slug exists but value differs — flag for user decision |
| **add** | New token, not in theme — will be added |

Present the full plan to the user before writing anything:

```
COLORS
  add     --color-navy: #1a2b4c        → also add to theme.json palette
  add     --color-sand: #f5f0e8        → also add to theme.json palette
  keep    --color-black: #000          → protected, skip
  update  --color-white: #fafafa       → currently #fff — confirm?

FONT FAMILIES
  add   --font-mono: "JetBrains Mono", monospace  → also add to theme.json fontFamilies

FONT SIZES  (all use customClamp)
  add     --text-4xl: customClamp(80, 120)  → also add to theme.json fontSizes as "4xl"
  update  --text-3xl: customClamp(56, 80)   → currently customClamp(48, 80) — confirm?

SPACING (required tokens — values updated to match design)
  update  --spacing-container-padding: rem(32)  → currently rem(24)
  update  --spacing-column: customClamp(32, 64) → currently customClamp(24, 52)
  update  --spacing-block: rem(48)              → currently rem(36); also update theme.json blockGap
  update  --spacing-ssm-0: 0                    → unchanged
  update  --spacing-ssm-1: rem(40)              → currently rem(32)
  update  --spacing-ssm-2: rem(64)              → currently rem(54)
  update  --spacing-ssm-3: rem(96)              → currently rem(80)
  update  --spacing-ssm-4: rem(148)             → currently rem(130)
  update  --spacing-ssm-5: rem(180)             → currently rem(154)
  update  --spacing-ssm-6: rem(240)             → currently rem(200)

DARK BACKGROUNDS (shared/backgrounds.js)
  add   'navy'   → treat as dark background

OTHER TOKENS (:root only)
  add   --radius-card: rem(12)
```

Wait for user confirmation. If any token is marked **update**, ask explicitly before changing the existing value. **Never remove** `--color-black`, `--color-white`, or `--spacing-ssm-0` through `--spacing-ssm-6` even if they are not present in the Figma design.

---

## Step 3.5 — Add BugHerd Script (if provided)

If the user provides a BugHerd `<script>` tag, add it to both:

1. **`static/index.html`** — inside `<head>`, before `</head>`:

```html
<script type="text/javascript" src="https://www.bugherd.com/sidebarv2.js?apikey=APIKEY" async="true"></script>
```

2. **`static/.storybook/preview-head.html`** — at the top of the file, before any existing `<style>` tags:

```html
<script type="text/javascript" src="https://www.bugherd.com/sidebarv2.js?apikey=APIKEY" async="true"></script>
```

Use the exact `<script>` tag the user provided — do not alter the `apikey` or any attributes.

If neither file contains an existing BugHerd script, add it. If one already exists (same `apikey`), skip. If one exists with a different `apikey`, replace it.

---

## Step 4 — Write `resources/styles/settings/theme.css`

Add new tokens in the correct location within the file:

- **Colors** → inside `@theme { }`, under the `/* Colors */` comment, with the pattern `--color-{slug}: {value};`
- **Font families** → inside `@theme { }`, under `/* Font family */`, with `--font-{slug}: {stack};`
- **Font sizes** → inside `@theme { }`, under `/* Text size */`, with `--text-{slug}: {value};`. Use `customClamp(min, max)` for fluid sizes if the project already uses that pattern.
- **Other reusable tokens** → in `:root { }` at the bottom of the file

### Step 4a — Update `resources/styles/settings/safelist.css`

After adding or updating any colours, update the `@source inline(...)` line that safelists `bg-*` and `text-*` utilities to include every colour slug (new and existing, including `black` and `white`):

```css
@source inline("{!,}{bg,text}-{black,white,navy,sand}");
```

List every colour slug inside the `{…}` group. This ensures Tailwind generates the utility classes even when they are not referenced directly in scanned source files.

```css
@theme {
    /* Colors */
    --color-*: initial;
    --color-black: #000;
    --color-white: #fff;
    --color-navy: #1a2b4c;   /* ← new */
    --color-sand: #f5f0e8;   /* ← new */

    /* Font family */
    --font-*: initial;
    --font-sans-serif: "Source Sans 3", sans-serif;
    --font-mono: "JetBrains Mono", monospace;   /* ← new */

    /* Text size */
    --text-*: initial;
    --text-3xl: customClamp(48, 80);
    --text-4xl: customClamp(80, 120);   /* ← new */
    /* ... */
}

:root {
    /* ... existing ... */
    --radius-card: 0.75rem;   /* ← new */
}
```

---

## Step 4.5 — Add Google Fonts to `index.php`, `static/index.html`, and Storybook

For each font family extracted from Figma, check whether it is available on Google Fonts.

If **any** of the fonts are on Google Fonts:

1. Build a single combined set of `<link>` tags that loads all Google-hosted fonts in one request. Use the `family` query parameter with `+` for spaces and `|` to separate multiple families. Request all weights present in the Figma design.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
```

2. Add those `<link>` tags to **all three** of the following files:

  - **`index.php`** — inside `<head>`, before `<?php wp_head(); ?>`
  - **`static/index.html`** — inside `<head>`, before the BugHerd `<script>` tag (or before `</head>` if no BugHerd script)
  - **`static/.storybook/preview-head.html`** — at the top of the file, before the BugHerd `<script>` tag (or before any `<style>` tags)

If a font is **not** on Google Fonts (custom, licensed, or self-hosted), skip it here — note it to the user so they can add it manually.

If Google Fonts links already exist in any of these files, update them to include any new families rather than duplicating the tags.

---

## Step 5 — Write `theme.json`

Add new entries to the relevant arrays. Follow the exact same JSON structure as the existing entries.

### Colors → `settings.color.palette`

```json
{
  "color": "#1a2b4c",
  "name": "Navy",
  "slug": "navy"
}
```

The `name` is Title Case. The `slug` matches the CSS variable suffix (`--color-{slug}`).

### Font families → `settings.typography.fontFamilies`

```json
{
  "fontFamily": "var(--font-mono)",
  "name": "Monospace",
  "slug": "mono"
}
```

### Font sizes → `settings.typography.fontSizes`

```json
{
  "name": "4XL",
  "size": "var(--text-4xl)",
  "slug": "4xl"
}
```

The `size` always references the CSS variable — never a raw value.

### Block gap → `styles.spacing.blockGap`

When `--spacing-block` changes, also update `theme.json`'s `styles.spacing.blockGap` — it references the variable and drives the default vertical gap between all blocks in the editor:

```json
"styles": {
  "spacing": {
    "blockGap": "var(--spacing-block)"
  }
}
```

The value should always be `"var(--spacing-block)"` — do not hardcode a size here.

### Spacing sizes → `settings.spacing.spacingSizes`

Only add entries here if the spacing needs to be selectable in the WP block editor (e.g. for custom padding/margin controls). Follow the existing pattern:

```json
{
  "name": "104 (416px)",
  "slug": "104",
  "size": "26rem"
}
```

---

## Step 6 — Update `shared/backgrounds.js`

If any new colour should be treated as a dark background (requires light text), add its slug to the `darkBackground` array:

```js
export const darkBackground = [
    'black',
    'navy',   // ← new
];
```

---

## Step 7 — Verify Tailwind Picks Up New Tokens

No extra step needed — Tailwind v4 reads the `@theme` block automatically and generates utility classes for every `--color-*`, `--font-*`, `--text-*`, and `--spacing-*` variable defined there.

New colour `--color-navy` → automatically available as `bg-navy`, `text-navy`, `border-navy`.
New font `--font-mono` → available as `font-mono`.
New size `--text-4xl` → available as `text-4xl`.

---

## Final Checklist

- [ ] BugHerd script added to `static/index.html` and `static/.storybook/preview-head.html` if provided by user
- [ ] Both theme files + `shared/backgrounds.js` read before fetching Figma
- [ ] All Figma links fetched via MCP; colors, fonts, sizes, and spacing extracted
- [ ] Cross-reference complete; plan shown to user with `add / update / keep / skip` per token
- [ ] User confirmed before writing — **update** entries confirmed explicitly
- [ ] `--color-black` and `--color-white` preserved in both files — never removed
- [ ] `--spacing-ssm-0` through `--spacing-ssm-6` all present — values updated, none removed
- [ ] `--spacing-container-padding`, `--spacing-column`, `--spacing-block` all present — values updated to match design
- [ ] All font sizes use `customClamp(minPx, maxPx)` — no static px/rem values for `--text-*`
- [ ] `resources/styles/settings/theme.css` — vars in correct section inside `@theme {}`; other tokens in `:root`
- [ ] `resources/styles/settings/safelist.css` — `{bg,text}-{…}` inline source updated to include all colour slugs (new and existing)
- [ ] `theme.json` — `styles.spacing.blockGap` updated if `--spacing-block` changed; new palette/font/size entries added; `size` always references CSS var
- [ ] `shared/backgrounds.js` — dark colour slugs added if applicable
- [ ] Google Fonts checked for each font family — `<link>` tags added to `index.php`, `static/index.html`, and `static/.storybook/preview-head.html` for any Google-hosted fonts; non-Google fonts noted to user
- [ ] No arbitrary values anywhere — every design value is a named token in `theme.css`
