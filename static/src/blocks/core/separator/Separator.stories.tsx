import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator';
import { colorSlugs, marginArgTypes, blockArgTypes } from '@lib/storybook-helpers';
import { colorLabels } from '@lib/theme';

const meta: Meta<typeof Separator> = {
    title: 'Blocks/Core/Separator',
    component: Separator,
    tags: ['autodocs'],
    argTypes: {
        // Content
        tagName: {
            control: 'select',
            options: [
                'hr',
                'div',
            ],
            description: 'HTML element',
        },

        // Colors
        backgroundColor: {
            control: { type: 'select', labels: colorLabels },
            options: colorSlugs,
            description: '→ has-{slug}-color',
            table: { category: 'Colors' },
        },

        // Spacing
        ...marginArgTypes,

        // Layout
        align: {
            control: 'select',
            options: [
                'center',
                'wide',
                'full',
            ],
        },

        // Block
        ...blockArgTypes,
    },
};
export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
    args: { tagName: 'hr' },
};
