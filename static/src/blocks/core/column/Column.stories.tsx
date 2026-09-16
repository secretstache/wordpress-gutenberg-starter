import type React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Column } from './Column';
import { Paragraph } from '@blocks/core/paragraph/Paragraph';
import { Heading } from '@blocks/core/heading/Heading';
import { colorArgTypes, typographyArgTypes, paddingArgTypes, borderArgTypes, shadowArgType, blockArgTypes, spacingArgType } from '@lib/storybook-helpers';

const meta: Meta<typeof Column> = {
    title: 'Blocks/Core/Column',
    component: Column,
    tags: ['autodocs'],
    argTypes: {
        // Content
        width: { control: 'text' as const, description: 'flex-basis e.g. "50%" or "200px"' },
        verticalAlignment: {
            control: 'select' as const,
            options: [
                'top',
                'center',
                'bottom',
            ],
        },

        // Colors
        ...colorArgTypes,

        // Typography
        ...typographyArgTypes,

        // Spacing
        ...paddingArgTypes,
        blockSpacing: spacingArgType('gap between inner blocks'),

        // Layout
        useContentWidth: { control: 'boolean', description: 'Inner blocks use content width', table: { category: 'Layout' } },
        contentWidth: { control: 'text', description: 'Content width (e.g. 800px)', table: { category: 'Layout' }, if: { arg: 'useContentWidth', eq: true } },
        justifyContent: {
            control: 'select' as const,
            options: [
                'left',
                'center',
                'right',
            ],
            description: 'Justification',
            table: { category: 'Layout' },
            if: { arg: 'useContentWidth', eq: true },
        },

        // Border
        ...borderArgTypes,

        // Shadow
        ...shadowArgType,

        // Block
        ...blockArgTypes,

        // Internal
        children: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof Column>;

function renderColumn(args: React.ComponentProps<typeof Column>) {
    return (
        <Column {...args}>
            <Heading
                content="Column heading"
                level={3}
            />
            <Paragraph>Column content goes here.</Paragraph>
        </Column>
    );
}

export const Default: Story = {
    render: renderColumn,
    args: { justifyContent: 'center' },
};
