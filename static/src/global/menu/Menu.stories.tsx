import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';
import { mainMenu, offcanvasMenu, footerMenu } from '@data/navigation';

const meta: Meta<typeof Menu> = {
    title: 'Global/Menu',
    component: Menu,
    tags: ['autodocs'],
    parameters: {
        html: {
            preJs: true,
            transform: () => (window as any).__sbPreJsHtml__ ?? '',
        },
        docs: {
            source: {
                // Replace the expanded items array with its variable name.
                // The regex matches `items={[` ... `\n  ]}` — the closing `\n  ]}`
                // is unique to the top-level prop, so nested objects don't interfere.
                transform: (src: string, ctx: any) => {
                    const name = ctx.parameters?.itemsName;
                    if (!name) return src;
                    return src.replace(/items=\{[\s\S]*?\n {2}\]\}/, `items={${name}}`);
                },
            },
        },
    },
    argTypes: {
        items: { table: { disable: true } },
        variant: { control: 'select', options: ['dropdown', 'horizontal', 'vertical'] },
        className: { control: 'text' },
        submenuClass: { control: 'text' },
    },
};
export default meta;
type Story = StoryObj<typeof Menu>;

export const Dropdown: Story = {
    args: {
        items: mainMenu,
        variant: 'dropdown',
        className: 'gap-x-9',
        submenuClass: 'bg-black bg-dark p-4 min-w-50',
    },
    parameters: { itemsName: 'mainMenu' },
};

export const Horizontal: Story = {
    args: {
        items: footerMenu,
        variant: 'horizontal',
        className: 'gap-x-6',
    },
    parameters: { itemsName: 'footerMenu' },
};

export const Vertical: Story = {
    args: {
        items: offcanvasMenu,
        variant: 'vertical',
        className: 'gap-y-3',
    },
    parameters: { itemsName: 'offcanvasMenu' },
};
