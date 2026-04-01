# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WordPress theme built on [Sage](https://roots.io/sage/) with SSM Core integration. Uses Blade templating, Laravel's Acorn container, ACF for custom fields, and Gutenberg block editor with custom blocks.

## Commands

### Root (WordPress Theme)

```bash
yarn dev          # Vite dev server for theme assets
yarn build        # Build theme assets (outputs to /public/build)
yarn lint         # Run JS, CSS, and Prettier linting
```

### Static (React/Storybook)

```bash
cd static
yarn install      # Install static dependencies
yarn dev          # Vite dev server for React components
yarn storybook    # Storybook on port 6006
yarn build-storybook  # Build Storybook
```

### Shortcuts from root

```bash
yarn static-install   # cd static && yarn install
yarn static-build     # cd static && yarn build
yarn static-start     # cd static && yarn dev
```

### PHP

```bash
composer install  # Install PHP dependencies
```

## Architecture

This project has a dual-build architecture:

### 1. WordPress Theme (`/` root)

- **`/app/`** — PHP theme logic: custom blocks (`/app/Blocks/`), ACF fields (`/app/Fields/`), view composers (`/app/View/Composers/`), service providers
- **`/config/`** — Theme configuration (app, view, assets, patterns)
- **`/resources/`** — Source assets:
  - `/scripts/client/` — Frontend JS (critical.js, app.js)
  - `/scripts/editor/` — Gutenberg editor JS (editor.js)
  - `/styles/` — CSS (app.css, editor-canvas.css, editor-ui.css, admin.css) with block-specific styles in `/styles/blocks/`
  - `/views/` — Blade templates
- **`/public/build/`** — Compiled output (do not edit directly)
- **`/theme.json`** — WordPress block editor settings (colors, typography, spacing, layout)
- **`/vite.config.js`** — Root Vite config using Laravel Vite Plugin + `@roots/vite-plugin`

### 2. React Component Library (`/static/`)

- **`/static/src/blocks/`** — Block components organized as `core/` and `custom/`
  - Each block has: `BlockName.tsx` and `BlockName.stories.tsx`
  - `core/` — Static React views of core WordPress blocks
  - `custom/` — Custom project-specific blocks
- **`/static/src/global/`** — Site-level components: hamburger, menu, offcanvas, site-footer, site-header
- **`/static/src/lib/`** — Shared utilities (all TypeScript):
  - `block-props.ts` — Mirrors `@wordpress/block-editor` helpers (colors, borders, spacing, typography, layout)
  - `theme.ts` — Theme data helpers derived from `theme.json` (palette, fontSizes, fontFamilies, spacingSizes)
  - `storybook-helpers.ts` — Shared Storybook argType helpers
  - `cn.ts` — Minimal className utility
  - `url.ts` — URL utilities
  - `wp-global-styles.ts` — Injects WP global styles into the React app
- **`/static/src/layouts/`** — Page layout wrappers (e.g. `Default.tsx`)
- **`/static/src/pages/`** — React Router page components
- **`/static/.storybook/`** — Storybook config targeting `src/**/*.stories.@(jsx|tsx)`

### 3. Shared Utilities (`/shared/`)

Shared between both build contexts.

## Key Patterns

**Block registration:** Custom Gutenberg blocks are PHP classes in `/app/Blocks/` extending `Block.php`. Block JSON definitions live in `/static/src/blocks/`.

**Styling:** Tailwind CSS v4 throughout. CSS variables for design tokens defined in `/resources/styles/settings/`. The `theme.json` drives block editor controls.

**Vite aliases (root):** `@scripts`, `@styles`, `@fonts`, `@images`, `@modules` resolve to `/resources/` subdirectories.

**Vite aliases (static):** `@theme` → `../theme.json`, `@styles` → `../resources/styles`, `@scripts` → `src/assets/scripts`, `@shared` → `../shared`, `@data` → `src/data`, `@global` → `src/global`, `@blocks` → `src/blocks`, `@layouts` → `src/layouts`, `@lib` → `src/lib`, `@pages` → `src/pages`.

**REST API:** Custom endpoints registered in `functions.php` under `ssm/v1/` namespace.

**ACF:** Custom fields defined in `/app/Fields/`. Options pages provide global settings (GTM, analytics, custom scripts).

## Commit Messages

Always use this format: `[FIX|FEATURE]{component}: {description}`

- Use `[Feature]` for new functionality, `[Fix]` for bug fixes
- Component is the affected block, file, or area (e.g. `Block grid`, `Typography`, `Header`)
- Description is lowercase, plain English, starting with a verb

## Linting & Conventions

- **Prettier** (`.prettierrc`): 4-space indent, single quotes (JS/TS), double quotes (CSS), `printWidth: 1000` (no wrapping). Applies project-wide.
- **ESLint** (`eslint.config.js`): Covers `resources/scripts/` only — the `static/` directory is ignored. Key rules: arrow-function components only (`react/function-component-definition`), blank line before every `return` (`padding-line-between-statements`), single quotes, semicolons always.
- **Stylelint** (`.stylelintrc`): Covers `resources/styles/` only. Extends `stylelint-config-tailwindcss`. Custom functions `customClamp`, `rem`, `-rem`, `svgUri` are whitelisted.
- Run `yarn lint` from root to auto-fix all three for theme assets. For `static/`, run `npx prettier static/src --write` and `npx eslint --no-ignore static/src --ext .ts,.tsx --fix` manually.

## Gotchas
- `/shared/` is used by both build contexts — changes affect both
- `theme.json` is the source of truth for design tokens in the editor; CSS variables in `/resources/styles/settings/` must stay in sync   
