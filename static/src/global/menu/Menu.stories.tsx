import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';
import { mainMenu, offcanvasMenu } from '@data/navigation';

const meta: Meta<typeof Menu> = {
    title: 'Global/Menu',
    component: Menu,
    tags: ['autodocs'],
    argTypes: {
        items: { table: { disable: true } },
        menuClass: { control: 'text' },
        submenuClass: { control: 'text' },
    },
};
export default meta;
type Story = StoryObj<typeof Menu>;

export const Horizontal: Story = {
    args: {
        items: mainMenu,
        menuClass: 'menu is-dropdown gap-x-9 flex',
        submenuClass: 'top-full min-w-50 bg-black p-5 text-white',
    },
};

export const Vertical: Story = {
    args: {
        items: offcanvasMenu,
        menuClass: 'flex flex-col',
    },
};
