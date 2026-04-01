import { Link } from 'react-router-dom';
import type { MenuItem } from '@data/navigation';

export interface MenuProps {
    items?: MenuItem[];
    menuClass?: string;
    submenuClass?: string;
}

/**
 * Recursive menu component that renders a list and supports nested submenus.
 */
export const Menu = ({ items = [], menuClass, submenuClass }: MenuProps) => {
    if (!items.length) return null;

    return (
        <ul className={menuClass}>
            {items.map((item) => (
                <li key={item.url}>
                    <Link to={item.url}>{item.label}</Link>
                    {(item.children?.length ?? 0) > 0 && (
                        <Menu
                            items={item.children}
                            menuClass={submenuClass}
                            submenuClass={submenuClass}
                        />
                    )}
                </li>
            ))}
        </ul>
    );
};

export default Menu;
