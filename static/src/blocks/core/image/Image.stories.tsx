import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';
import { fullMarginArgTypes, borderArgTypes, shadowArgType, blockArgTypes } from '@lib/storybook-helpers';

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
const ASPECT_RATIO_LABELS: Record<string, string> = {
    'auto': 'Original',
    '1': 'Square - 1:1',
    '4/3': 'Standard - 4:3',
    '3/4': 'Portrait - 3:4',
    '3/2': 'Classic - 3:2',
    '2/3': 'Classic Portrait - 2:3',
    '16/9': 'Wide - 16:9',
    '9/16': 'Tall - 9:16',
};

const meta: Meta<typeof Image> = {
    title: 'Blocks/Core/Image',
    component: Image,
    tags: ['autodocs'],
    argTypes: {
        // Image
        url: { control: 'text', description: 'Image URL' },
        alt: { control: 'text' },
        caption: { control: 'text' },
        title: { control: 'text', description: 'img title attribute' },

        // Spacing
        ...fullMarginArgTypes,

        // Link
        href: { control: 'text', table: { category: 'Link' } },
        linkTarget: {
            control: 'select',
            options: [
                '_blank',
                '_self',
            ],
            table: { category: 'Link' },
        },

        // Dimensions
        width: { control: 'text', table: { category: 'Dimensions' } },
        height: { control: 'text', table: { category: 'Dimensions' } },
        aspectRatio: {
            control: { type: 'select', labels: ASPECT_RATIO_LABELS },
            options: ASPECT_RATIO_OPTIONS,
            table: { category: 'Dimensions' },
        },
        scale: {
            control: 'select',
            options: [
                'cover',
                'contain',
            ],
            description: 'object-fit',
            table: { category: 'Dimensions' },
        },

        // Border (applied to <img>)
        ...borderArgTypes,

        // Shadow (applied to <img>)
        ...shadowArgType,

        // Layout
        align: { control: 'select' as const },

        // Block
        ...blockArgTypes,
    },
};
export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
    args: { url: 'assets/images/cms/placeholder.svg', alt: 'Placeholder image' },
};
