import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';
import { fullMarginArgTypes, borderArgTypes, shadowArgType, blockArgTypes, aspectRatioArgType } from '@lib/storybook-helpers';

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
        ...aspectRatioArgType,
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
