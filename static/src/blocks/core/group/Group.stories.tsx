import type { Meta, StoryObj } from '@storybook/react';
import { Group } from './Group';
import { Heading } from '@blocks/core/heading/Heading';
import { Paragraph } from '@blocks/core/paragraph/Paragraph';
import { colorArgTypes, typographyArgTypes, paddingArgTypes, marginArgTypes, borderArgTypes, shadowArgType, blockArgTypes, colorSlugs, spacingArgType } from '@lib/storybook-helpers';

const meta: Meta<any> = {
    title: 'Blocks/Core/Group',
    component: Group,
    tags: ['autodocs'],
    argTypes: {
        // Content
        tagName: {
            control: 'select',
            options: [
                'div',
                'section',
                'article',
                'aside',
                'main',
                'header',
                'footer',
            ],
            description: 'HTML element',
        },

        // Colors
        textColor: colorArgTypes.textColor,
        backgroundColor: colorArgTypes.backgroundColor,
        borderColor: {
            control: { type: 'select' },
            options: colorSlugs,
            description: '→ has-{slug}-border-color',
            table: { category: 'Colors' },
        },

        // Typography
        ...typographyArgTypes,

        // Spacing
        ...paddingArgTypes,
        ...marginArgTypes,
        blockSpacing: spacingArgType('spacing between children'),

        // Layout
        align: { control: 'select' as const },
        type: {
            control: 'select',
            options: [
                'group',
                'row',
                'stack',
                'grid',
            ],
            description: 'group → constrained, row/stack → flex, grid → grid',
            table: { category: 'Layout' },
        },

        // Group (constrained) options
        useContentWidth: { control: 'boolean', description: 'Inner blocks use content width', table: { category: 'Layout' }, if: { arg: 'type', eq: 'group' } },
        contentWidth: { control: 'text', description: 'Content width (e.g. 800px)', table: { category: 'Layout' }, if: { arg: 'useContentWidth', eq: true } },
        groupJustification: {
            control: 'select',
            options: [
                'left',
                'center',
                'right',
            ],
            description: 'Justification',
            table: { category: 'Layout' },
            if: { arg: 'useContentWidth', eq: true },
        },

        // Row (flex horizontal) options
        rowJustification: {
            control: 'select',
            options: [
                'left',
                'center',
                'right',
                'space-between',
            ],
            description: 'Justification',
            table: { category: 'Layout' },
            if: { arg: 'type', eq: 'row' },
        },
        rowVerticalAlignment: {
            control: 'select',
            options: [
                'top',
                'center',
                'bottom',
                'stretch',
            ],
            description: 'Vertical alignment',
            table: { category: 'Layout' },
            if: { arg: 'type', eq: 'row' },
        },
        rowWrap: { control: 'boolean', description: 'Allow to wrap to multiple lines', table: { category: 'Layout' }, if: { arg: 'type', eq: 'row' } },

        // Stack (flex vertical) options
        stackJustification: {
            control: 'select',
            options: [
                'left',
                'center',
                'right',
                'stretch',
            ],
            description: 'Justification',
            table: { category: 'Layout' },
            if: { arg: 'type', eq: 'stack' },
        },
        stackVerticalAlignment: {
            control: 'select',
            options: [
                'top',
                'center',
                'bottom',
                'space-between',
            ],
            description: 'Vertical alignment',
            table: { category: 'Layout' },
            if: { arg: 'type', eq: 'stack' },
        },
        stackWrap: { control: 'boolean', description: 'Allow to wrap to multiple lines', table: { category: 'Layout' }, if: { arg: 'type', eq: 'stack' } },

        // Grid options
        gridItemPosition: {
            control: 'select',
            options: [
                'auto',
                'manual',
            ],
            description: 'Grid item position',
            table: { category: 'Layout' },
            if: { arg: 'type', eq: 'grid' },
        },
        gridMinimumColumnWidth: { control: 'text', description: 'Minimum column width (e.g. 23rem)', table: { category: 'Layout' }, if: { arg: 'gridItemPosition', eq: 'auto' } },
        gridColumnsCount: {
            control: 'select',
            options: [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
            ],
            description: 'Number of columns',
            table: { category: 'Layout' },
            if: { arg: 'gridItemPosition', eq: 'manual' },
        },

        // Background
        backgroundImage: { control: 'text', description: 'Background image URL', table: { category: 'Background' } },

        // Dimensions
        minHeight: { control: 'text', description: 'Minimum height', table: { category: 'Dimensions' } },

        // Border
        borderRadius: borderArgTypes.borderRadius,
        borderWidth: borderArgTypes.borderWidth,
        borderStyle: borderArgTypes.borderStyle,

        // Shadow
        ...shadowArgType,

        // Block
        ...blockArgTypes,

        // Internal
        gradient: { table: { disable: true } },
        justifyContent: { table: { disable: true } },
        verticalAlignment: { table: { disable: true } },
        flexWrap: { table: { disable: true } },
        columnCount: { table: { disable: true } },
        minimumColumnWidth: { table: { disable: true } },
        children: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: ({ type, useContentWidth, contentWidth, groupJustification, rowJustification, rowVerticalAlignment, rowWrap, stackJustification, stackVerticalAlignment, stackWrap, gridItemPosition, gridMinimumColumnWidth, gridColumnsCount, ...args }) => {
        let layoutProps: Record<string, unknown> = {};
        if (type === 'group') {
            layoutProps = {
                ...(useContentWidth && { useContentWidth }),
                ...(useContentWidth && contentWidth && { contentWidth }),
                ...(useContentWidth && groupJustification && { justifyContent: groupJustification }),
            };
        } else if (type === 'row') {
            layoutProps = {
                justifyContent: rowJustification ?? 'left',
                verticalAlignment: rowVerticalAlignment ?? 'center',
                flexWrap: rowWrap ? 'wrap' : 'nowrap',
            };
        } else if (type === 'stack') {
            layoutProps = {
                justifyContent: stackJustification ?? 'left',
                verticalAlignment: stackVerticalAlignment ?? 'top',
                flexWrap: stackWrap ? 'wrap' : 'nowrap',
            };
        } else if (type === 'grid') {
            if (gridItemPosition === 'manual') {
                layoutProps = {
                    gridItemPosition: 'manual',
                    ...(gridColumnsCount && { columnCount: gridColumnsCount }),
                };
            } else {
                layoutProps = {
                    gridItemPosition: 'auto',
                    ...(gridMinimumColumnWidth && { minimumColumnWidth: gridMinimumColumnWidth }),
                };
            }
        }

        return (
            <Group
                {...args}
                {...(type && { type })}
                {...layoutProps}>
                <Heading
                    content="Group heading"
                    level={2}
                />
                <Paragraph>This is a paragraph inside a group block.</Paragraph>
            </Group>
        );
    },
    args: { type: 'group' },
};
