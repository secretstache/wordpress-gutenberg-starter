---
name: prepare-editor-structure
description: Use this skill to prepare and create all Gutenberg blocks from the static component library. Trigger phrases include "prepare editor structure", "prepare blocks", "static is ready", "static is ready prepare blocks", "create all blocks", "spec and create blocks", "create blocks from static". Generates docs/ui-breakdown.yml spec, waits for developer review, then automatically creates all blocks via migrate-static or register-block.
version: 3.0.0
---

# Prepare Editor Structure Skill

Generates `docs/ui-breakdown.yml` from the static component library, waits for developer review, then creates all blocks sequentially. A single command to go from static components to fully registered Gutenberg blocks.

> **Source of truth:** The static React library in `static/src/blocks/` — read via Storybook MCP when available, or directly from TSX files as a fallback. Both `custom/` and `core/` blocks are in scope.

---

## Phase 1 — Discover Components

### 1.1 — Read static library via Storybook MCP

**Primary: Storybook MCP** (requires `yarn storybook` running from `/static`)

1. Call `mcp__storybook__list-all-documentation` to get all stories.
2. Collect entries whose `title` starts with `Blocks/Custom/` or `Blocks/Core/`.
3. For each entry, extract:
  - `id` — the Storybook story ID
  - `title` — e.g. `Blocks/Custom/Accordion`
  - Component name — last segment of `title` (e.g. `Accordion`)
  - Block slug — kebab-case of the component name (e.g. `accordion`)

**Fallback: TSX files** (if Storybook is not running)

1. List all directories inside `static/src/blocks/custom/` → custom block slugs.
2. List all directories inside `static/src/blocks/core/` → core block overrides.
3. Derive the component name and slug from each directory name.

### 1.2 — Check registration status

For each discovered block, check whether it is already registered:

- Look for `resources/scripts/editor/blocks/{slug}/` directory.
- Status: **registered** if the directory exists, **unregistered** if not.

### 1.3 — Report and confirm

Present a table to the user:

```
Component       | Slug              | Status
--------------- | ----------------- | ------------
Accordion       | accordion         | registered
CallToAction    | call-to-action    | registered
Testimonials    | testimonials      | unregistered
```

Ask: are there any blocks to exclude before generating the spec? Wait for confirmation before proceeding.

---

## Phase 2 — Generate `docs/ui-breakdown.yml`

For each component in the confirmed list:

### 2.1 — Read the props

**Primary: Storybook MCP**

Call `mcp__storybook__get-documentation` with the story ID. This returns the TypeScript props interface, story args, and variants. Use this as the authoritative prop list.

**Fallback: TSX file**

Read `static/src/blocks/custom/{slug}/{ComponentName}.tsx` (or the `core/` equivalent) and extract the exported props interface directly.

### 2.2 — Map props to controls

Apply this mapping to every prop:

| Static prop type | `type` / `control` value | Notes |
|---|---|---|
| `boolean` | `ToggleControl` | InspectorControls |
| `string` visible inline content (title, label, heading shown in block body) | `RichText` | inline in block markup — add `tag:` (h2/h3/p/span) if not default span |
| `string` config / sidebar text (year, URL label, secondary text) | `TextControl` | InspectorControls |
| `string` URL / link+tab | `LinkControl` | generates `__experimentalLinkControl` |
| `string` enum 2–4 options | `ToggleGroupControl` | InspectorControls |
| `string` enum 5+ options | `SelectControl` | InspectorControls |
| `{ value, slug }` color | `ColorPaletteControl` | InspectorControls |
| `{ id, url, alt }` media | `MediaControl` | InspectorControls |
| `number` | `RangeControl` | InspectorControls |
| preview toggle (data-query blocks) | `PreviewControl` | InspectorControls |
| spacing props (all collapsed) | `ResponsiveSpacingControl` (single entry) | InspectorControls |
| `ReactNode` / `children` | `InnerBlocks` | block markup |
| `Item[]` complex array | child block via `inner_blocks` | — |

**RichText decision rule:**
- Use `control: RichText` when the editor would click the text directly in the block canvas to edit it (the text is the primary visible content of the item — a label, title, or heading inside the card/button/item).
- Use `TextControl` when the text is a configuration value the editor would change from the sidebar (year, URL label, secondary identifier).
- Quick check: click in canvas → `RichText`. Go to sidebar → `TextControl`.

**`inline_fields` for parent blocks:** If the parent block itself has inline-editable text (outside child blocks), add an `inline_fields` array at the block level with `{name, tag, placeholder}` entries. These generate `<RichText>` in the parent's `edit.jsx` — NOT in InspectorControls.

**Boolean naming:** Boolean props get the `is` prefix in block attributes (e.g. TSX `openFirstOnLoad` → attribute `isOpenedByDefault`).

**Skip entirely:** `align`, `className`, `id` — handled by WP core.

### 2.3 — Determine render strategy

- **`server-side`:** block receives data from a CPT/taxonomy query.
- **`client-side`:** purely presentational, no DB data at render time.
- **`innerblocks-parent`:** has a `children` prop or an `Item[]` prop rendered with `.map()`.

### 2.4 — Identify inner blocks

If the component renders an `Item[]` array with `.map()` over complex JSX, a dedicated child block is needed (e.g. `accordion` → `accordion-item`).

### 2.5 — Write the spec entry

One YAML key per block. The block slug is the top-level key — no `slug:` field needed.

```yaml
{slug}:
render: server-side | client-side | innerblocks-parent
php_wrapper: true   # only when block needs "render":"index" PHP + save:()=><InnerBlocks.Content />
controls:
  - label: Layout
    type: ToggleGroupControl
    attr: layout
    options: [option-a, option-b]
    default: option-a
  - label: Image
    type: MediaControl
    attr: image
  - label: Open First on Load
    type: ToggleControl
    attr: isOpenedByDefault
  - label: Spacing
    type: ResponsiveSpacingControl
inner_blocks:
  - slug: {child-slug}
    attrs:
      - {name: title, type: string, control: RichText}
      - {name: image, type: object, control: MediaControl}
      - {name: content, control: InnerBlocks}
data_source:
  type: cpt | taxonomy
  name: {post_type_or_taxonomy_slug}
  query_attrs: [queryType, numberOfPosts, curatedTerms, curatedPosts]
```

**Schema rules:**
- `controls`: omit `options`/`default` when not applicable; omit `attr` for `ResponsiveSpacingControl`
- `inner_blocks`: omit when no child blocks
- `php_wrapper`: omit unless needed
- `data_source`: omit for non-query blocks
- To skip a block: add `skip: true` at the top level

Write the complete file to `docs/ui-breakdown.yml` with a header comment:
```yaml
# UI Breakdown — block registration spec
# Top-level key = block slug
# Add skip: true to any block to exclude from registration
```

After writing, stop and tell the user:

> "Spec written to `docs/ui-breakdown.yml` — N blocks total (M registered, K unregistered).
>
> **Review the spec now.** Edit any field directly. Add `skip: true` to exclude a block.
>
> Reply **'ready'** when you want me to create all blocks."

---

## Phase 3 — Developer Review Gate

Wait for the user to reply `ready` (or any explicit confirmation), then proceed to Phase 4.

---

## Phase 4 — Sequential Block Registration

1. **Re-read `docs/ui-breakdown.yml`** — any edits since Phase 2 are authoritative.

2. **Collect all blocks** where `skip: true` is not set.

3. **Present execution plan:**
   ```
   Processing N blocks:
     accordion       → migrate-static  (static component exists)
     amenities       → migrate-static
     call-to-action  → migrate-static
     testimonials    → register-block  (no static component)
   ```

4. **For each block, one at a time:**
  - Check if `static/src/blocks/custom/{slug}/` exists:
    - **Yes** → apply the full **migrate-static workflow** (all steps). Step 0 will read `docs/ui-breakdown.yml` automatically and use the YAML spec as the source of truth.
    - **No** → apply the full **register-block workflow** (all steps), using the YAML spec entry as the requirements source instead of gathering requirements from the user.
  - Complete the block fully before moving to the next.
  - Report `✓ {slug} — done` after each block.

5. **Final summary** — list all files created or updated across all blocks.

---

## Project-agnostic notes

- **Namespace:** defaults to `ssm/`. If this project uses a different namespace, ask once at the start of Phase 1 and use it throughout.
- **Storybook title prefixes:** assumes `Blocks/Custom/` and `Blocks/Core/`. If the project uses different conventions, scan the full list from `mcp__storybook__list-all-documentation` and identify relevant stories by context.
- **`docs/ui-breakdown.yml`:** always written to this path. Overwrites any existing content with the freshly generated spec.
- **Child blocks:** include both parent and child entries. Register child as part of the parent's migration run — do not add it to `editor.js` as a top-level import.
