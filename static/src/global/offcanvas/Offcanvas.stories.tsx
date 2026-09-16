import type { Meta, StoryObj } from '@storybook/react';
import { Offcanvas } from './Offcanvas';

const meta: Meta<typeof Offcanvas> = {
    title: 'Global/Offcanvas',
    component: Offcanvas,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        isOpen: { control: 'boolean' },
    },
};
export default meta;
type Story = StoryObj<typeof Offcanvas>;

export const Default: Story = { args: { isOpen: true } };
