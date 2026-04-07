import type { Meta, StoryObj } from '@storybook/react';
import { Cover } from './Cover';
import { Heading } from '@blocks/core/heading/Heading';
import { Paragraph } from '@blocks/core/paragraph/Paragraph';
import { colorArgTypes, typographyArgTypes, paddingArgTypes, marginArgTypes, borderArgTypes, shadowArgType, blockArgTypes, colorSlugs, spacingArgType } from '@lib/storybook-helpers';
import { colorLabels } from '@lib/theme';

const ASPECT_RATIO_OPTIONS = [
    'auto',
    '1',
    '4/3',
    '3/4',
    '3/2',
    '2/3',
    '16/9',
    '9/16',
];
const ASPECT_RATIO_LABELS = {
    'auto': 'Original',
    '1': 'Square - 1:1',
    '4/3': 'Standard - 4:3',
    '3/4': 'Portrait - 3:4',
    '3/2': 'Classic - 3:2',
    '2/3': 'Classic Portrait - 2:3',
    '16/9': 'Wide - 16:9',
    '9/16': 'Tall - 9:16',
};

const CONTENT_POSITIONS = [
    'top left',
    'top center',
    'top right',
    'center left',
    'center center',
    'center right',
    'bottom left',
    'bottom center',
    'bottom right',
];

const meta: Meta<typeof Cover> = {
    title: 'Blocks/Core/Cover',
    component: Cover,
    tags: ['autodocs'],
    argTypes: {
        // Content
        tagName: {
            control: 'select',
            options: [
                'div',
                'section',
                'article',
                'header',
                'footer',
                'aside',
                'main',
            ],
        },

        // Colors (text only — no background color support per block.json)
        textColor: colorArgTypes.textColor,

        // Typography
        ...typographyArgTypes,

        // Spacing
        ...paddingArgTypes,
        ...marginArgTypes,
        blockSpacing: spacingArgType('gap between inner blocks'),

        // Background
        backgroundType: {
            table: { category: 'Background' },
            control: 'select',
            options: [
                'image',
                'video',
            ],
        },
        url: { control: 'text', description: 'Background image or video URL', table: { category: 'Background' } },
        hasParallax: { control: 'boolean', table: { category: 'Background' }, if: { arg: 'backgroundType', eq: 'image' } },
        isRepeated: { control: 'boolean', table: { category: 'Background' }, if: { arg: 'backgroundType', eq: 'image' } },
        videoPoster: { control: 'text', description: 'Video poster URL', table: { category: 'Background' }, if: { arg: 'backgroundType', eq: 'video' } },

        // Overlay
        overlayColor: {
            control: { type: 'select', labels: colorLabels },
            options: colorSlugs,
            description: '→ has-{slug}-background-color on overlay',
            table: { category: 'Overlay' },
        },
        customOverlayColor: { control: 'color', description: 'Custom overlay color (when no preset slug)', table: { category: 'Overlay' } },
        dimRatio: { control: { type: 'range', min: 0, max: 100, step: 10 }, description: '0–100 overlay opacity', table: { category: 'Overlay' } },

        // Layout
        useContentWidth: { control: 'boolean', description: 'Inner blocks use content width', table: { category: 'Layout' } },
        contentWidth: { control: 'text', description: 'Content width (e.g. 800px)', table: { category: 'Layout' }, if: { arg: 'useContentWidth', eq: true } },
        contentPosition: { control: 'select', options: CONTENT_POSITIONS, table: { category: 'Layout' } },
        align: { control: 'select' as const },

        // Dimensions
        minHeight: { control: 'text', description: 'Min-height (e.g. 400px, 50vh, 100%)', table: { category: 'Dimensions' } },
        fullHeight: { control: 'boolean', description: 'min-height: 100vh; aspect-ratio: unset', table: { category: 'Dimensions' } },
        aspectRatio: {
            control: { type: 'select', labels: ASPECT_RATIO_LABELS },
            options: ASPECT_RATIO_OPTIONS,
            description: 'min-height: unset; aspect-ratio: …',
            table: { category: 'Dimensions' },
        },

        // Border
        ...borderArgTypes,

        // Shadow
        ...shadowArgType,

        // Block
        ...blockArgTypes,

        // Internal
        mediaId: { table: { disable: true } },
        children: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof Cover>;

export const Default: Story = {
    render: (args) => (
        <Cover {...args}>
            <Heading
                content="Cover Heading"
                level={2}
                textAlign="center"
            />
            <Paragraph textAlign="center">This text sits on top of the cover background.</Paragraph>
        </Cover>
    ),
    args: {
        dimRatio: 100,
        overlayColor: 'black',
    },
};

export const ImageBackground: Story = {
    render: (args) => (
        <Cover {...args}>
            <Heading
                content="Cover Heading"
                level={2}
                textAlign="center"
            />
            <Paragraph textAlign="center">This text sits on top of the cover background.</Paragraph>
        </Cover>
    ),
    args: {
        url: 'assets/images/cms/placeholder.svg',
        backgroundType: 'image',
        overlayColor: 'black',
        dimRatio: 50,
    },
};
