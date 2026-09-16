import type { Meta, StoryObj } from '@storybook/react';
import { Video } from './Video';
import { paddingArgTypes, fullMarginArgTypes, blockArgTypes } from '@lib/storybook-helpers';

const meta: Meta<typeof Video> = {
    title: 'Blocks/Core/Video',
    component: Video,
    tags: ['autodocs'],
    argTypes: {
        // Video
        src: { control: 'text', description: 'Video source URL' },
        poster: { control: 'text', description: 'Poster image URL' },
        controls: { control: 'boolean' },
        autoplay: { control: 'boolean' },
        loop: { control: 'boolean' },
        muted: { control: 'boolean' },
        playsInline: { control: 'boolean' },
        preload: {
            control: 'select',
            options: [
                'metadata',
                'auto',
                'none',
            ],
            description: 'metadata = default (omitted from HTML)',
        },
        caption: { control: 'text' },

        // Spacing
        ...paddingArgTypes,
        ...fullMarginArgTypes,

        // Block
        ...blockArgTypes,

        // Layout
        align: { control: 'select' as const },

        // Internal
        tracks: { table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof Video>;

export const Default: Story = {
    args: { src: 'assets/video/placeholder.mp4', controls: true, preload: 'metadata' },
};
