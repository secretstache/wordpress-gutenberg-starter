/**
 * Generates WordPress-style global CSS custom properties and utility classes
 * from theme.json, mirroring what WordPress outputs as `global-styles-inline-css`.
 *
 * Produces:
 *   --wp--preset--color--{slug}
 *   --wp--preset--font-size--{slug}
 *   --wp--preset--font-family--{slug}
 *   --wp--preset--spacing--{slug}
 *   .has-{slug}-color / .has-{slug}-background-color / .has-{slug}-border-color
 *   .has-{slug}-font-size / .has-{slug}-font-family
 *   .has-{slug}-gradient-background
 */
import themeJson from '@theme';

const { color, typography, spacing } = themeJson.settings ?? {};

/** WordPress inserts a hyphen between a digit and a letter in preset slugs. */
export function wpSlug(slug: string): string {
    return slug.replace(/(\d)([a-z])/gi, '$1-$2');
}

// ─── CSS custom properties (on :root) ────────────────────────────────────────

function colorVars(): string {
    return (color?.palette ?? []).map(({ slug, color: value }) => `--wp--preset--color--${slug}: ${value};`).join('\n  ');
}

function fontSizeVars(): string {
    return (typography?.fontSizes ?? []).map(({ slug, size }) => `--wp--preset--font-size--${wpSlug(slug)}: ${size};`).join('\n  ');
}

function fontFamilyVars(): string {
    return (typography?.fontFamilies ?? []).map(({ slug, fontFamily }) => `--wp--preset--font-family--${slug}: ${fontFamily};`).join('\n  ');
}

function spacingVars(): string {
    return (spacing?.spacingSizes ?? []).map(({ slug, size }) => `--wp--preset--spacing--${slug}: ${size};`).join('\n  ');
}

// ─── Utility classes ─────────────────────────────────────────────────────────

function colorClasses(): string {
    return (color?.palette ?? [])
        .map(
            ({ slug }) => `
.has-${slug}-color { color: var(--wp--preset--color--${slug}) !important; }
.has-${slug}-background-color { background-color: var(--wp--preset--color--${slug}) !important; }
.has-${slug}-border-color { border-color: var(--wp--preset--color--${slug}); }`,
        )
        .join('');
}

function fontSizeClasses(): string {
    return (typography?.fontSizes ?? [])
        .map(
            ({ slug }) => `
.has-${wpSlug(slug)}-font-size { font-size: var(--wp--preset--font-size--${wpSlug(slug)}); }`,
        )
        .join('');
}

function fontFamilyClasses(): string {
    return (typography?.fontFamilies ?? [])
        .map(
            ({ slug }) => `
.has-${slug}-font-family { font-family: var(--wp--preset--font-family--${slug}); }`,
        )
        .join('');
}

// ─── Static WP layout / structural rules ─────────────────────────────────────

const STATIC_CSS = `
:root {
  --wp--preset--aspect-ratio--square: 1;
  --wp--preset--aspect-ratio--4-3: 4/3;
  --wp--preset--aspect-ratio--3-4: 3/4;
  --wp--preset--aspect-ratio--3-2: 3/2;
  --wp--preset--aspect-ratio--2-3: 2/3;
  --wp--preset--aspect-ratio--16-9: 16/9;
  --wp--preset--aspect-ratio--9-16: 9/16;
  --wp--style--global--content-size: var(--container-default);
  --wp--style--global--wide-size: var(--container-wide);
  --wp--style--block-gap: var(--spacing-block);
}

:where(body) { margin: 0; }

body {
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
}

.wp-site-blocks > .alignleft  { float: left;  margin-right: 2em; }
.wp-site-blocks > .alignright { float: right; margin-left: 2em; }
.wp-site-blocks > .aligncenter { justify-content: center; margin-left: auto; margin-right: auto; }

:where(.wp-site-blocks) > * { margin-block-start: var(--spacing-block); margin-block-end: 0; }
:where(.wp-site-blocks) > :first-child { margin-block-start: 0; }
:where(.wp-site-blocks) > :last-child  { margin-block-end: 0; }

:root :where(.is-layout-flow) > :first-child { margin-block-start: 0; }
:root :where(.is-layout-flow) > :last-child  { margin-block-end: 0; }
:root :where(.is-layout-flow) > * { margin-block-start: var(--spacing-block); margin-block-end: 0; }

:root :where(.is-layout-constrained) > :first-child { margin-block-start: 0; }
:root :where(.is-layout-constrained) > :last-child  { margin-block-end: 0; }
:root :where(.is-layout-constrained) > * { margin-block-start: var(--spacing-block); margin-block-end: 0; }

:root :where(.is-layout-flex)  { gap: var(--spacing-block); }
:root :where(.is-layout-grid)  { gap: var(--spacing-block); }

.is-layout-flow > .alignleft   { float: left;  margin-inline-start: 0; margin-inline-end: 2em; }
.is-layout-flow > .alignright  { float: right; margin-inline-start: 2em; margin-inline-end: 0; }
.is-layout-flow > .aligncenter { margin-left: auto !important; margin-right: auto !important; }

.is-layout-constrained > .alignleft   { float: left;  margin-inline-start: 0; margin-inline-end: 2em; }
.is-layout-constrained > .alignright  { float: right; margin-inline-start: 2em; margin-inline-end: 0; }
.is-layout-constrained > .aligncenter { margin-left: auto !important; margin-right: auto !important; }
.is-layout-constrained > :where(:not(.alignleft):not(.alignright):not(.alignfull)) {
  max-width: var(--wp--style--global--content-size);
  margin-left: auto !important;
  margin-right: auto !important;
}
.is-layout-constrained > .alignwide { max-width: var(--wp--style--global--wide-size); }

body .is-layout-flex { display: flex; }
.is-layout-flex { flex-wrap: wrap; align-items: center; }
.is-layout-flex > :is(*, div) { margin: 0; }

/* Horizontal flex: justification → justify-content */
.is-layout-flex.is-content-justification-left         { justify-content: flex-start; }
.is-layout-flex.is-content-justification-center       { justify-content: center; }
.is-layout-flex.is-content-justification-right        { justify-content: flex-end; }
.is-layout-flex.is-content-justification-space-between { justify-content: space-between; }

/* Horizontal flex: verticalAlignment → align-items */
.is-layout-flex.is-vertically-aligned-top     { align-items: flex-start; }
.is-layout-flex.is-vertically-aligned-center  { align-items: center; }
.is-layout-flex.is-vertically-aligned-bottom  { align-items: flex-end; }
.is-layout-flex.is-vertically-aligned-stretch { align-items: stretch; }

/* Vertical flex (orientation=vertical): axes swap */
.is-layout-flex.is-vertical { flex-direction: column; }
.is-layout-flex.is-vertical.is-content-justification-left          { align-items: flex-start; }
.is-layout-flex.is-vertical.is-content-justification-center        { align-items: center; }
.is-layout-flex.is-vertical.is-content-justification-right         { align-items: flex-end; }
.is-layout-flex.is-vertical.is-content-justification-stretch       { align-items: stretch; }
.is-layout-flex.is-vertical.is-vertically-aligned-top              { justify-content: flex-start; }
.is-layout-flex.is-vertical.is-vertically-aligned-center           { justify-content: center; }
.is-layout-flex.is-vertical.is-vertically-aligned-bottom           { justify-content: flex-end; }
.is-layout-flex.is-vertical.is-vertically-aligned-stretch          { justify-content: stretch; }
.is-layout-flex.is-vertical.is-vertically-aligned-space-between    { justify-content: space-between; }

/* Wrap */
.is-layout-flex.is-nowrap { flex-wrap: nowrap; }

body .is-layout-grid { display: grid; }
.is-layout-grid > :is(*, div) { margin: 0; }
`;

// ─── Assemble ─────────────────────────────────────────────────────────────────

export function generateWpGlobalStyles(): string {
    const rootVars = [
        colorVars(),
        fontSizeVars(),
        fontFamilyVars(),
        spacingVars(),
    ]
        .filter(Boolean)
        .join('\n  ');

    return `:root {
  ${rootVars}
}
${colorClasses()}
${fontSizeClasses()}
${fontFamilyClasses()}
${STATIC_CSS}`;
}

/**
 * Injects the generated styles into <head> as the first <style> element,
 * before any other stylesheets so WP preset classes have lower specificity.
 */
export function injectWpGlobalStyles(): void {
    const id = 'wp-global-styles-static';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = generateWpGlobalStyles();
    document.head.insertBefore(style, document.head.firstChild);
}
