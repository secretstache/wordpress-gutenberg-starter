/**
 * Shared Storybook helpers for block stories.
 *
 * Provides common option arrays, argType definitions, and a shared buildStyle
 * function to eliminate boilerplate from individual story files.
 */
import { palette, colorLabels, fontSizes, fontSizeLabels, fontFamilies, fontFamilyLabels, spacingSizes, spacingLabels } from '@lib/theme';

// ─── Common option arrays ────────────────────────────────────────────────────

export const colorSlugs = palette.map(({ slug }) => slug);
export const fontSizeSlugs = fontSizes.map(({ slug }) => slug);
export const fontFamilySlugs = fontFamilies.map(({ slug }) => slug);
export const spacingOptions = spacingSizes.map(({ slug }) => slug);

// ─── spacingArgType factory ──────────────────────────────────────────────────

/** Returns an argType definition for a single spacing select control (theme.json presets). */
export function spacingArgType(description = '') {
    return {
        control: { type: 'select' as const, labels: spacingLabels },
        options: spacingOptions,
        description: description || 'theme.json spacing preset',
        table: { category: 'Spacing' },
    };
}

// ─── Shared argType groups ───────────────────────────────────────────────────

/** textColor, backgroundColor */
export const colorArgTypes = {
    textColor: {
        control: { type: 'select' as const, labels: colorLabels },
        options: colorSlugs,
        description: '→ has-{slug}-color',
        table: { category: 'Colors' },
    },
    backgroundColor: {
        control: { type: 'select' as const, labels: colorLabels },
        options: colorSlugs,
        description: '→ has-{slug}-background-color',
        table: { category: 'Colors' },
    },
};

/** borderColor, borderRadius, borderWidth, borderStyle */
export const borderArgTypes = {
    borderColor: {
        control: { type: 'select' as const, labels: colorLabels },
        options: colorSlugs,
        description: '→ has-{slug}-border-color',
        table: { category: 'Border' },
    },
    borderRadius: { control: 'text' as const, table: { category: 'Border' } },
    borderWidth: { control: 'text' as const, table: { category: 'Border' } },
    borderStyle: {
        control: 'select' as const,
        options: [
            'solid',
            'dashed',
            'dotted',
            'none',
        ],
        table: { category: 'Border' },
    },
};

/** CSS box-shadow */
export const shadowArgType = {
    shadow: { control: 'text' as const, description: 'CSS box-shadow value', table: { category: 'Shadow' } },
};

/** className, id */
export const blockArgTypes = {
    className: { control: 'text' as const, description: 'Additional CSS classes', table: { category: 'Block' } },
    id: { control: 'text' as const, description: 'HTML anchor id', table: { category: 'Block' } },
};

/** padding: top, bottom, left, right */
export const paddingArgTypes = {
    paddingTop: spacingArgType('padding top'),
    paddingBottom: spacingArgType('padding bottom'),
    paddingLeft: spacingArgType('padding left'),
    paddingRight: spacingArgType('padding right'),
};

/** margin: top, bottom */
export const marginArgTypes = {
    marginTop: spacingArgType('margin top'),
    marginBottom: spacingArgType('margin bottom'),
};

/** margin: top, bottom, left, right */
export const fullMarginArgTypes = {
    ...marginArgTypes,
    marginLeft: spacingArgType('margin left'),
    marginRight: spacingArgType('margin right'),
};

export const aspectRatioOptions = [
    'auto',
    '1',
    '4/3',
    '3/4',
    '3/2',
    '2/3',
    '16/9',
    '9/16',
];

export const aspectRatioLabels: Record<string, string> = {
    'auto': 'Original',
    '1': 'Square - 1:1',
    '4/3': 'Standard - 4:3',
    '3/4': 'Portrait - 3:4',
    '3/2': 'Classic - 3:2',
    '2/3': 'Classic Portrait - 2:3',
    '16/9': 'Wide - 16:9',
    '9/16': 'Tall - 9:16',
};

/** Aspect ratio preset select control. */
export const aspectRatioArgType = {
    aspectRatio: {
        control: { type: 'select' as const, labels: aspectRatioLabels },
        options: aspectRatioOptions,
        table: { category: 'Dimensions' },
    },
};

/**
 * Block-level alignment (wide + full).
 * Use for blocks that support alignwide / alignfull.
 */
export const alignArgType = {
    align: {
        control: 'select' as const,
        options: [
            'wide',
            'full',
        ],
    },
};

/**
 * Block-level alignment with all directions (left, center, right, wide, full).
 * Use for image, video, embed, gallery, table blocks.
 */
export const fullAlignArgType = {
    align: {
        control: 'select' as const,
        options: [
            'left',
            'center',
            'right',
            'wide',
            'full',
        ],
    },
};

/**
 * Text alignment (left, center, right) for inline content blocks.
 * Use for Button, Heading, Paragraph.
 */
export const textAlignArgType = {
    textAlign: {
        control: 'select' as const,
        options: [
            'left',
            'center',
            'right',
        ],
        table: { category: 'Typography' },
    },
};

export const typographyArgTypes = {
    fontSize: {
        control: { type: 'select' as const, labels: fontSizeLabels },
        options: fontSizeSlugs,
        description: '→ has-{slug}-font-size',
        table: { category: 'Typography' },
    },
    fontFamily: {
        control: { type: 'select' as const, labels: fontFamilyLabels },
        options: fontFamilySlugs,
        table: { category: 'Typography' },
    },
    fontWeight: {
        control: 'select' as const,
        options: [
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
        ],
        table: { category: 'Typography' },
    },
    fontStyle: {
        control: 'select' as const,
        options: [
            'normal',
            'italic',
        ],
        table: { category: 'Typography' },
    },
    textTransform: {
        control: 'select' as const,
        options: [
            'none',
            'uppercase',
            'lowercase',
            'capitalize',
        ],
        table: { category: 'Typography' },
    },
    textDecoration: {
        control: 'select' as const,
        options: [
            'none',
            'underline',
            'line-through',
        ],
        table: { category: 'Typography' },
    },
    letterSpacing: { control: 'text' as const, table: { category: 'Typography' } },
    lineHeight: { control: 'text' as const, table: { category: 'Typography' } },
};
