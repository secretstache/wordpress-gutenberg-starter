import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Button } from './Button';
import { colorArgTypes, typographyArgTypes, textAlignArgType, paddingArgTypes, borderArgTypes, shadowArgType, blockArgTypes } from '@lib/storybook-helpers';

const meta: Meta<typeof Button> = {
    title: 'Blocks/Core/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        // Colors
        ...colorArgTypes,

        // Typography
        ...textAlignArgType,
        ...typographyArgTypes,

        // Spacing
        ...paddingArgTypes,

        // Border
        ...borderArgTypes,

        // Shadow
        ...shadowArgType,

        // Block
        ...blockArgTypes,
    },
    args: {
        tagName: 'a',
        customStyle: 'fill',
    },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Fill: Story = {
    args: { text: 'Button', url: '#', customStyle: 'fill' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const link = canvas.getByRole('link', { name: 'Button' });
        await expect(link).toBeInTheDocument();
        await expect(link).toHaveAttribute('href', '#');
        await expect(link.closest('.wp-block-button')).toHaveClass('is-style-fill');
    },
};

export const Outline: Story = {
    args: { text: 'Button', url: '#', customStyle: 'outline' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const link = canvas.getByRole('link', { name: 'Button' });
        await expect(link).toBeInTheDocument();
        await expect(link.closest('.wp-block-button')).toHaveClass('is-style-outline');
    },
};
