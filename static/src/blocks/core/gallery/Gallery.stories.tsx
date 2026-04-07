import type { Meta, StoryObj } from '@storybook/react';
import { Gallery } from './Gallery';
import { Image } from '@blocks/core/image/Image';
import { colorArgTypes, paddingArgTypes, fullMarginArgTypes, borderArgTypes, blockArgTypes, spacingArgType } from '@lib/storybook-helpers';

const meta: Meta<typeof Gallery> = {
    title: 'Blocks/Core/Gallery',
    component: Gallery,
    tags: ['autodocs'],
    argTypes: {
        // Content
        columns: {
            control: { type: 'select' },
            options: [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
            ],
            description: 'Number of columns',
        },
        imageCrop: { control: 'boolean', description: 'Crop images to same height' },
        caption: { control: 'text' },

        // Colors (no text color for gallery)
        backgroundColor: colorArgTypes.backgroundColor,

        // Spacing
        ...paddingArgTypes,
        ...fullMarginArgTypes,
        blockSpacingRow: spacingArgType('vertical gap between images'),
        blockSpacingColumn: spacingArgType('horizontal gap between images'),

        // Border
        ...borderArgTypes,

        // Block
        ...blockArgTypes,

        // Layout
        align: { control: 'select' as const },

        // Internal
        children: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof Gallery>;

export const Default: Story = {
    render: (args) => (
        <Gallery {...args}>
            <Image
                url="assets/images/cms/placeholder.svg"
                alt="Gallery image 1"
            />
            <Image
                url="assets/images/cms/placeholder.svg"
                alt="Gallery image 2"
            />
            <Image
                url="assets/images/cms/placeholder.svg"
                alt="Gallery image 3"
            />
        </Gallery>
    ),
    args: { columns: 3, imageCrop: true },
};
