import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';
import { colorArgTypes, typographyArgTypes, paddingArgTypes, marginArgTypes, borderArgTypes, blockArgTypes, textAlignArgType } from '@lib/storybook-helpers';

const meta: Meta<typeof Heading> = {
    title: 'Blocks/Core/Heading',
    component: Heading,
    tags: ['autodocs'],
    argTypes: {
        // Content
        content: { control: 'text' },
        level: {
            control: 'select',
            options: [
                1,
                2,
                3,
                4,
                5,
                6,
            ],
            description: 'HTML heading level',
        },

        // Colors
        textColor: colorArgTypes.textColor,
        backgroundColor: colorArgTypes.backgroundColor,

        // Typography
        ...textAlignArgType,
        ...typographyArgTypes,

        // Spacing
        ...paddingArgTypes,
        ...marginArgTypes,

        // Border
        ...borderArgTypes,

        // Layout
        align: { control: 'select' as const },

        // Block
        ...blockArgTypes,
    },
};
export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
    args: { content: 'The quick brown fox jumps over the lazy dog', level: 2 , fontSize: '3xl'},
};
