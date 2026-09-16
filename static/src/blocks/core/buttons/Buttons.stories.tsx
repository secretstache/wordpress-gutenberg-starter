import type { Meta, StoryObj } from '@storybook/react';
import { Buttons } from './Buttons';
import { Button } from '@blocks/core/button/Button';
import { colorArgTypes, typographyArgTypes, paddingArgTypes, marginArgTypes, borderArgTypes, blockArgTypes, spacingArgType, textAlignArgType } from '@lib/storybook-helpers';

const meta: Meta<typeof Buttons> = {
    title: 'Blocks/Core/Buttons',
    component: Buttons,
    tags: ['autodocs'],
    argTypes: {
        justification: {
            control: 'select' as const,
            options: [
                'left',
                'center',
                'right',
                'space-between',
            ],
            table: { category: 'Layout' },
            description: '→ is-content-justification-{value}',
        },
        verticalAlignment: {
            control: 'select' as const,
            options: [
                'top',
                'center',
                'bottom',
                'stretch',
            ],
            table: { category: 'Layout' },
            description: '→ is-vertically-aligned-{value}',
        },
        orientation: {
            control: 'select' as const,
            options: [
                'horizontal',
                'vertical',
            ],
            table: { category: 'Layout' },
            description: '→ is-{value} e.g. is-vertical',
        },
        flexWrap: {
            control: 'select' as const,
            options: [
                'wrap',
                'nowrap',
            ],
            table: { category: 'Layout' },
            description: '→ is-nowrap',
        },

        // Colors (text color disabled for Buttons block per block.json)
        backgroundColor: colorArgTypes.backgroundColor,

        // Typography
        ...textAlignArgType,
        ...typographyArgTypes,

        // Spacing
        blockSpacingHorizontal: spacingArgType('column gap (horizontal)'),
        blockSpacingVertical: spacingArgType('row gap (vertical)'),
        ...paddingArgTypes,
        ...marginArgTypes,

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
type Story = StoryObj<typeof Buttons>;

export const Default: Story = {
    render: (args) => (
        <Buttons {...args}>
            <Button
                text="Primary"
                url="#"
                customStyle="fill"
            />
            <Button
                text="Secondary"
                url="#"
                customStyle="outline"
            />
        </Buttons>
    ),
    args: {},
};
