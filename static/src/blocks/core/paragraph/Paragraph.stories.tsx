import type { Meta, StoryObj } from '@storybook/react';
import { Paragraph } from './Paragraph';
import { colorArgTypes, typographyArgTypes, paddingArgTypes, marginArgTypes, borderArgTypes, textAlignArgType } from '@lib/storybook-helpers';

const meta: Meta<typeof Paragraph> = {
    title: 'Blocks/Core/Paragraph',
    component: Paragraph,
    tags: ['autodocs'],
    argTypes: {
        // Colors
        textColor: colorArgTypes.textColor,
        backgroundColor: colorArgTypes.backgroundColor,

        // Typography
        dropCap: { control: 'boolean', description: 'First letter as drop cap (suppressed when centered/right-aligned)', table: { category: 'Typography' } },
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
        className: { control: 'text', description: 'Additional CSS classes on the paragraph element', table: { category: 'Block' } },
        id: { control: 'text', description: 'HTML id on the paragraph element (anchor)', table: { category: 'Block' } },
    },
};
export default meta;
type Story = StoryObj<typeof Paragraph>;

export const Default: Story = {
    args: {},
    render: (args) => (
        <Paragraph {...args}>
            The quick <strong>brown fox</strong> jumps over the <a href="#">lazy dog</a>.
        </Paragraph>
    ),
};
