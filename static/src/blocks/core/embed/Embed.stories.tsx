import type { Meta, StoryObj } from '@storybook/react';
import { Embed } from './Embed';
import { fullMarginArgTypes, blockArgTypes } from '@lib/storybook-helpers';

const meta: Meta<typeof Embed> = {
    title: 'Blocks/Core/Embed',
    component: Embed,
    tags: ['autodocs'],
    argTypes: {
        // Content
        url: { control: 'text', description: 'YouTube, Vimeo, or any oEmbed URL' },
        title: { control: 'text', description: 'iframe title (from oEmbed response)' },
        caption: { control: 'text' },

        // Spacing (margin only per block.json)
        ...fullMarginArgTypes,

        // Layout
        align: { control: 'select' as const },

        // Block
        ...blockArgTypes,
    },
};
export default meta;
type Story = StoryObj<typeof Embed>;

export const YouTube: Story = {
    args: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up' },
};
