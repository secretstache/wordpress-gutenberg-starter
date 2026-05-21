---
name: create-static-page
description: Use this skill when the user wants to create a new React page in the static/ library and register it in the router. Trigger phrases include "create a static page", "add a page", "new page called", "add a route for", or any request that creates a new page component in static/src/pages/.
version: 1.1.0
---

# Create Static Page Skill

This skill **creates a new React page component** in `static/src/pages/` and registers it as a route in `static/src/App.tsx`.

---

## Step 0 — Gather Requirements

Ask the user for:

1. **Page name** — PascalCase component name (e.g. `HousingPrograms`, `About`, `TeamDirectory`)
2. **Route path** — kebab-case URL path (e.g. `/housing-programs`). If not provided, derive it from the page name.
3. **Figma link or image** — optional; if provided, fetch via Figma MCP tool or read the image
4. **Layout variant** — which `DefaultLayout` prop to use (e.g. `siteHeaderVariant="without-background"`). Defaults to plain `<DefaultLayout>`.

### Check whether the page already exists

Look for `static/src/pages/{PageName}.tsx`. If it exists, ask:
> A page called `{PageName}` already exists. Do you want to **update it** or **use a different name**?

---

## Step 1 — Analyse the Design

If a Figma link or image was provided, fetch the design via the Figma MCP tool or read the image.

Identify:
- Sections and their visual hierarchy
- Existing blocks that map to the design (check `static/src/blocks/` via Storybook MCP)
- Any new blocks that would need to be created first (use the `static-create-block` skill for those)
- Image/photo assets — download, convert to WebP q80, save to `resources/images/cms/`

If no design was provided, scaffold a minimal placeholder using `SectionWrapper` + `Heading` + `Paragraph`.

---

## Step 2 — Present the Plan

Before writing any files, present:

1. **Route** — the path that will be registered (e.g. `/housing-programs`)
2. **Layout** — which `DefaultLayout` variant will be used
3. **Sections** — list of top-level `SectionWrapper` sections with the blocks inside each
4. **New blocks needed** — any blocks that don't yet exist (will require `static-create-block` first)
5. **Files to create/update:**
   ```
   CREATE:
     • static/src/pages/{PageName}.tsx
     • static/src/pages/{PageName}.stories.tsx

   UPDATE:
     • static/src/App.tsx  — add import + <Route path="{path}" ...>
   ```

Wait for confirmation before writing anything.

---

## Step 3 — `{PageName}.tsx`

`static/src/pages/{PageName}.tsx`

### Structure

```tsx
import { SectionWrapper } from '@blocks/custom/section-wrapper/SectionWrapper';
import { Heading } from '@blocks/core/heading/Heading';
// ... other block imports

export const {PageName} = () => {
    return (
        <>
            <title>{Page Title}</title>
            <SectionWrapper {sectionProps}>
                {/* section content */}
            </SectionWrapper>
            {/* additional sections */}
        </>
    );
};

export default {PageName};
```

### Rules

- Use `<title>` as the first child for the browser tab title
- Import only blocks from `@blocks/` — never raw HTML elements for layout
- Use existing block components; do not create new markup patterns inline
- No React state (`useState`, `useReducer`) — pages are static views
- Follow the same block prop conventions as `Home.tsx` (use Storybook MCP to verify prop names before using them)
- Use `assets/images/cms/` paths for images (Vite aliases the `assets/` prefix)

### Importing blocks

Always check exact prop names via Storybook MCP before using a block:
```
storybook_get-documentation({ component: '{BlockName}' })
```

---

## Step 4 — `{PageName}.stories.tsx`

`static/src/pages/{PageName}.stories.tsx`

### Structure

Mirror the layout decorator used in `App.tsx` — if the page uses `siteHeaderVariant="without-background"`, pass it to the decorator too.

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Default as DefaultLayout } from '@layouts/Default';
import { {PageName} } from './{PageName}';

const meta: Meta<typeof {PageName}> = {
    title: 'Pages/{PageName}',
    component: {PageName},
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <DefaultLayout{layoutProps}>
                <Story />
            </DefaultLayout>
        ),
    ],
};
export default meta;
type Story = StoryObj<typeof {PageName}>;

export const {PageName}_: Story = {
    name: '{Page Display Name}',
};
```

### Rules

- `layout: 'fullscreen'` is always set — pages need the full viewport
- The decorator wraps the story in the same `DefaultLayout` variant used in `App.tsx`
- The exported story name (`{PageName}_`) avoids collision with the component export; set `name` to the human-readable page title (e.g. `'Housing Programs'`)
- No `args` or `argTypes` needed — page components take no props

---

## Step 5 — Register the Route in `App.tsx`

`static/src/App.tsx`

1. Add the import after the existing page imports (keep alphabetical order):
   ```tsx
   import { {PageName} } from '@pages/{PageName}';
   ```

2. Add the `<Route>` before the catch-all `path="*"` route:
   ```tsx
   <Route
       path="{path}"
       element={<DefaultLayout{layoutProps}><{PageName} /></DefaultLayout>}
   />
   ```

   Where `{layoutProps}` is empty for the default layout or e.g. ` siteHeaderVariant="without-background"` when the hero needs a transparent header.

---

## Final Checklist

- [ ] Page name confirmed or derived; no existing file conflict
- [ ] Route path confirmed or derived from page name
- [ ] Figma design fetched and image assets downloaded/converted if provided; else minimal placeholder used
- [ ] Plan (route, layout, sections, new blocks needed, files list) presented and confirmed
- [ ] `static/src/pages/{PageName}.tsx` — `<title>` present; only `@blocks/` imports; no React state; named + default export
- [ ] `static/src/pages/{PageName}.stories.tsx` — `layout: 'fullscreen'`; decorator matches `App.tsx` layout variant; exported story uses trailing `_` naming with human-readable `name`
- [ ] `static/src/App.tsx` — import added in alphabetical order; `<Route>` added before the `path="*"` catch-all
- [ ] Storybook MCP used to verify prop names for every block used
- [ ] Any new blocks delegated to `static-create-block` skill before the page is written
