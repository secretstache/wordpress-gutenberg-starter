import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';

const meta: Meta<typeof Form> = {
    title: 'Blocks/Core/Form',
    component: Form,
    tags: ['autodocs'],
    argTypes: {

    },
};

export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
    args: {

    },
};

