import { Link } from 'react-router-dom';
import { cn } from '@lib/cn';
import type { MenuItem } from '@data/navigation';

export interface MenuProps {
    items?: MenuItem[];
    /**
     * `dropdown`   — horizontal nav with absolutely-positioned submenus.
     *                Requires `DropdownMenu` JS class to be initialised in WP.
     * `horizontal` — flat horizontal list, no submenus.
     * `vertical`   — stacked list, no submenu behaviour.
     */
    variant?: 'dropdown' | 'horizontal' | 'vertical';
    /** Extra classes applied to the root <ul> (layer 2 — visual / layout). */
    className?: string;
    /** Extra classes applied to every submenu <ul> (layer 2 — visual / layout). */
    submenuClass?: string;
}

const VARIANT_CLASS: Record<NonNullable<MenuProps['variant']>, string> = {
    dropdown: 'is-dropdown',
    horizontal: 'is-horizontal',
    vertical: 'is-vertical',
};

export const Menu = ({ items = [], variant = 'vertical', className, submenuClass }: MenuProps) => {
    if (!items.length) return null;

    return (
        <ul className={cn('menu', VARIANT_CLASS[variant], className)}>
            {items.map((item) => (
                <li key={item.url} className={item.children?.length ? 'menu-item-has-children' : undefined}>
                    <Link to={item.url}>{item.label}</Link>
                    {(item.children?.length ?? 0) > 0 && (
                        <Submenu items={item.children!} className={submenuClass} />
                    )}
                </li>
            ))}
        </ul>
    );
};

const Submenu = ({ items, className }: { items: MenuItem[]; className?: string }) => (
    <ul className={className}>
        {items.map((item) => (
            <li key={item.url}>
                <Link to={item.url}>{item.label}</Link>
            </li>
        ))}
    </ul>
);
