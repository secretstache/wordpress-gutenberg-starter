import type { Meta, StoryObj } from '@storybook/react';
import { SiteFooter } from './SiteFooter';

const meta: Meta<typeof SiteFooter> = {
    title: 'Global/SiteFooter',
    component: SiteFooter,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
};
export default meta;
type Story = StoryObj<typeof SiteFooter>;

export const Default: Story = {};
