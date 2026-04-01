import type { Meta, StoryObj } from '@storybook/react';
import { ListItem } from './ListItem';
import { List } from '@blocks/core/list/List';
import { colorArgTypes, typographyArgTypes, paddingArgTypes, fullMarginArgTypes, borderArgTypes, blockArgTypes } from '@lib/storybook-helpers';

const meta: Meta<typeof ListItem> = {
    title: 'Blocks/Core/ListItem',
    component: ListItem,
    tags: ['autodocs'],
    argTypes: {
        // Content
        content: { control: 'text' },

        // Colors
        textColor: colorArgTypes.textColor,
        backgroundColor: colorArgTypes.backgroundColor,

        // Typography
        ...typographyArgTypes,

        // Spacing
        ...paddingArgTypes,
        ...fullMarginArgTypes,

        // Border
        ...borderArgTypes,

        // Block
        ...blockArgTypes,

        // Internal
        children: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof ListItem>;

export const Default: Story = {
    render: (args) => (
        <List>
            <ListItem {...args} />
        </List>
    ),
    args: { content: 'List item content' },
};

export const WithNestedList: Story = {
    render: (args) => (
        <List>
            <ListItem content="First item" />
            <ListItem {...args}>
                <List>
                    <ListItem content="Nested item one" />
                    <ListItem content="Nested item two" />
                </List>
            </ListItem>
            <ListItem content="Third item" />
        </List>
    ),
    args: { content: 'Item with nested list' },
};
