import type { Meta, StoryObj } from '@storybook/react';
import { Default as DefaultLayout } from '@layouts/Default';
import { Contact } from './Contact';

const meta: Meta<typeof Contact> = {
    title: 'Pages/Contact',
    component: Contact,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [(Story) => <DefaultLayout><Story /></DefaultLayout>],
};
export default meta;
type Story = StoryObj<typeof Contact>;

export const Contact_: Story = {
    name: 'Contact',
};
