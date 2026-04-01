import type { Meta, StoryObj } from '@storybook/react';
import { List } from './List';
import { ListItem } from '@blocks/core/list-item/ListItem';
import { colorArgTypes, typographyArgTypes, paddingArgTypes, fullMarginArgTypes, borderArgTypes, blockArgTypes } from '@lib/storybook-helpers';

const DefaultItems = () => (
    <>
        <ListItem content="First list item" />
        <ListItem content="Second list item" />
        <ListItem content="Third list item" />
    </>
);

const meta: Meta<typeof List> = {
    title: 'Blocks/Core/List',
    component: List,
    tags: ['autodocs'],
    argTypes: {
        // List
        ordered: { control: 'boolean' },
        type: {
            control: 'select',
            options: [
                'decimal',
                'lower-alpha',
                'upper-alpha',
                'lower-roman',
                'upper-roman',
            ],
            description: 'List style type (ordered lists only)',
            if: { arg: 'ordered', eq: true },
        },
        reversed: { control: 'boolean', if: { arg: 'ordered', eq: true } },
        start: { control: 'number', description: 'Starting number (ordered lists only)', if: { arg: 'ordered', eq: true } },

        // Colors
        textColor: colorArgTypes.textColor,
        backgroundColor: colorArgTypes.backgroundColor,

        // Typography
        ...typographyArgTypes,

        // Spacing
        ...paddingArgTypes,
        ...fullMarginArgTypes,

        // Layout
        align: { control: 'select' as const },

        // Border
        ...borderArgTypes,

        // Block
        ...blockArgTypes,

        // Internal
        children: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof List>;

export const Unordered: Story = {
    render: (args) => (
        <List {...args}>
            <DefaultItems />
        </List>
    ),
    args: { ordered: false },
};

export const Ordered: Story = {
    render: (args) => (
        <List {...args}>
            <DefaultItems />
        </List>
    ),
    args: { ordered: true },
};
