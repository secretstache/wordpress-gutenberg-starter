import type { Meta, StoryObj } from '@storybook/react';
import { SiteHeader } from './SiteHeader';

const meta: Meta<typeof SiteHeader> = {
    title: 'Global/SiteHeader',
    component: SiteHeader,
    parameters: {
        layout: 'fullscreen',
    },
};
export default meta;
type Story = StoryObj<typeof SiteHeader>;

export const Default: Story = {};
