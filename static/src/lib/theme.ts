/**
 * Typed helpers derived from the root theme.json.
 *
 * Imported via the @theme alias (vite.config.js → ../theme.json).
 * All exports are plain arrays/maps — no React, no side-effects.
 */
import themeJson from '@theme';

const settings = themeJson.settings;

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------

export interface ColorEntry {
    slug: string;
    name: string;
    color: string;
}

export const palette: ColorEntry[] = settings.color?.palette ?? [];

/**
 * Map of slug → hex value for quick lookup.
 * e.g. colorMap.get('black') === '#000'
 */
export const colorMap = new Map<string, string>(
    palette.map(({ slug, color }) => [
        slug,
        color,
    ]),
);

/** Storybook labels map: slug → name (e.g. 'black' → 'Black') */
export const colorLabels: Record<string, string> = Object.fromEntries(
    palette.map(({ slug, name }) => [
        slug,
        name,
    ]),
);

/**
 * Resolve a named color slug to its hex value.
 * Returns undefined when the slug isn't in the palette.
 */
export function resolveColor(slug: string): string | undefined {
    return colorMap.get(slug);
}

// ---------------------------------------------------------------------------
// Font sizes
// ---------------------------------------------------------------------------

export interface FontSizeEntry {
    slug: string;
    name: string;
    size: string;
}

export const fontSizes: FontSizeEntry[] = settings.typography?.fontSizes ?? [];

/** slug → size value */
export const fontSizeMap = new Map<string, string>(
    fontSizes.map(({ slug, size }) => [
        slug,
        size,
    ]),
);

/** Storybook labels map: slug → name (e.g. 'lg' → 'LG') */
export const fontSizeLabels: Record<string, string> = Object.fromEntries(
    fontSizes.map(({ slug, name }) => [
        slug,
        name,
    ]),
);

// ---------------------------------------------------------------------------
// Font families
// ---------------------------------------------------------------------------

export interface FontFamilyEntry {
    slug: string;
    name: string;
    fontFamily: string;
}

export const fontFamilies: FontFamilyEntry[] = settings.typography?.fontFamilies ?? [];

/** slug → fontFamily value */
export const fontFamilyMap = new Map<string, string>(
    fontFamilies.map(({ slug, fontFamily }) => [
        slug,
        fontFamily,
    ]),
);

/** Storybook labels map: slug → name (e.g. 'sans-serif' → 'Sans serif') */
export const fontFamilyLabels: Record<string, string> = Object.fromEntries(
    fontFamilies.map(({ slug, name }) => [
        slug,
        name,
    ]),
);

// ---------------------------------------------------------------------------
// Spacing sizes
// ---------------------------------------------------------------------------

export interface SpacingSizeEntry {
    slug: string;
    name: string;
    size: string;
}

export const spacingSizes: SpacingSizeEntry[] = settings.spacing?.spacingSizes ?? [];

/** slug → size value */
export const spacingSizeMap = new Map<string, string>(
    spacingSizes.map(({ slug, size }) => [
        slug,
        size,
    ]),
);

/** Storybook labels map: slug → name (e.g. '4' → '4 (16px)') */
export const spacingLabels: Record<string, string> = Object.fromEntries(
    spacingSizes.map(({ slug, name }) => [
        slug,
        name,
    ]),
);

/**
 * Resolve a spacing value to its CSS variable reference.
 * - If value matches a slug in theme.json → returns var(--wp--preset--spacing--{slug})
 * - Otherwise → returns the value as-is (custom CSS value e.g. '1.5rem', '20px')
 * - undefined/empty → returns undefined
 */
export function resolveSpacing(value: string | undefined): string | undefined {
    if (!value) return undefined;

    return spacingSizeMap.has(value) ? `var(--wp--preset--spacing--${value})` : value;
}
