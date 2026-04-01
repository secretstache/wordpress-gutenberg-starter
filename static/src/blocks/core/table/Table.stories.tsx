import type { Meta, StoryObj } from '@storybook/react';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from './Table';
import { colorArgTypes, typographyArgTypes, paddingArgTypes, fullMarginArgTypes, borderArgTypes, blockArgTypes } from '@lib/storybook-helpers';

const meta: Meta<typeof Table> = {
    title: 'Blocks/Core/Table',
    component: Table,
    tags: ['autodocs'],
    argTypes: {
        // Content
        hasFixedLayout: { control: 'boolean', description: '→ has-fixed-layout' },
        caption: { control: 'text' },

        // Colors (applied to <table>)
        textColor: colorArgTypes.textColor,
        backgroundColor: colorArgTypes.backgroundColor,

        // Typography (applied to <figure>)
        ...typographyArgTypes,

        // Spacing (applied to <figure>)
        ...paddingArgTypes,
        ...fullMarginArgTypes,

        // Border (applied to <table>)
        ...borderArgTypes,

        // Layout
        align: { control: 'select' as const },

        // Block
        ...blockArgTypes,

        // Internal
        children: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
    render: (args) => (
        <Table {...args}>
            <Thead>
                <Tr>
                    <Th scope="col">Header 1</Th>
                    <Th scope="col">Header 2</Th>
                    <Th scope="col">Header 3</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>Row 1, Col 1</Td>
                    <Td>Row 1, Col 2</Td>
                    <Td>Row 1, Col 3</Td>
                </Tr>
                <Tr>
                    <Td>Row 2, Col 1</Td>
                    <Td>Row 2, Col 2</Td>
                    <Td>Row 2, Col 3</Td>
                </Tr>
                <Tr>
                    <Td>Row 3, Col 1</Td>
                    <Td>Row 3, Col 2</Td>
                    <Td>Row 3, Col 3</Td>
                </Tr>
            </Tbody>
        </Table>
    ),
    args: { hasFixedLayout: true },
};

export const WithFooter: Story = {
    render: (args) => (
        <Table {...args}>
            <Thead>
                <Tr>
                    <Th scope="col">Header 1</Th>
                    <Th scope="col">Header 2</Th>
                    <Th scope="col">Header 3</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>Row 1, Col 1</Td>
                    <Td>Row 1, Col 2</Td>
                    <Td>Row 1, Col 3</Td>
                </Tr>
                <Tr>
                    <Td>Row 2, Col 1</Td>
                    <Td>Row 2, Col 2</Td>
                    <Td>Row 2, Col 3</Td>
                </Tr>
            </Tbody>
            <Tfoot>
                <Tr>
                    <Td>Footer 1</Td>
                    <Td>Footer 2</Td>
                    <Td>Footer 3</Td>
                </Tr>
            </Tfoot>
        </Table>
    ),
    args: { hasFixedLayout: true },
};
