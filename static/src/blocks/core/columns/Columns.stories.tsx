import type { Meta, StoryObj } from '@storybook/react';
import { Columns } from './Columns';
import { Column } from '@blocks/core/column/Column';
import { Paragraph } from '@blocks/core/paragraph/Paragraph';
import { Heading } from '@blocks/core/heading/Heading';
import { colorArgTypes, typographyArgTypes, paddingArgTypes, marginArgTypes, borderArgTypes, shadowArgType, blockArgTypes, spacingArgType } from '@lib/storybook-helpers';

const meta: Meta<typeof Columns> = {
    title: 'Blocks/Core/Columns',
    component: Columns,
    tags: ['autodocs'],
    argTypes: {
        // Content
        verticalAlignment: {
            control: 'select',
            options: [
                'top',
                'center',
                'bottom',
            ],
        },
        isStackedOnMobile: { control: 'boolean' },

        // Colors
        textColor: colorArgTypes.textColor,
        backgroundColor: colorArgTypes.backgroundColor,

        // Typography
        ...typographyArgTypes,

        // Spacing
        ...paddingArgTypes,
        ...marginArgTypes,
        blockSpacingRow: spacingArgType('row gap between columns'),
        blockSpacingColumn: spacingArgType('column gap between columns'),

        // Border
        ...borderArgTypes,

        // Shadow
        ...shadowArgType,

        // Block
        ...blockArgTypes,

        // Layout
        align: { control: 'select' as const },

        // Internal
        children: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof Columns>;

export const Default: Story = {
    render: (args) => (
        <Columns {...args}>
            <Column backgroundColor={'black'}>
                <Heading
                    content="Column One"
                    level={3}
                />
                <Paragraph>Content for the first column.</Paragraph>
            </Column>
            <Column>
                <Heading
                    content="Column Two"
                    level={3}
                />
                <Paragraph>Content for the second column.</Paragraph>
                <Paragraph>Content for the second column.</Paragraph>
            </Column>
            <Column>
                <Heading
                    content="Column Three"
                    level={3}
                />
                <Paragraph>Content for the third column.</Paragraph>
            </Column>
        </Columns>
    ),
    args: {},
};
