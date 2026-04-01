import type { Meta, StoryObj } from '@storybook/react';
import { Default as DefaultLayout } from '@layouts/Default';
import { Home } from './Home';

const meta: Meta<typeof Home> = {
    title: 'Pages/Home',
    component: Home,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [(Story) => <DefaultLayout><Story /></DefaultLayout>],
};
export default meta;
type Story = StoryObj<typeof Home>;

export const Home_: Story = {
    name: 'Home',
};
