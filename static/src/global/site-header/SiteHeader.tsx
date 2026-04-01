import { Link } from 'react-router-dom';
import { url } from '@lib/url';
import { Hamburger } from '@global/hamburger/Hamburger';
import { Menu } from '@global/menu/Menu';
import { mainMenu } from '@data/navigation';

export const SiteHeader = (): JSX.Element => {
    return (
        <header className="site-header sticky top-0 left-0 w-full transition-all duration-300 z-50 [&.is-scrolling-down]:-translate-y-full bg-white">
            <div className="container flex items-center justify-between gap-x-2 py-3 py-6">
                <Link
                    to="/"
                    className="flex items-center mr-auto">
                    <img
                        src={url('/images/cms/logo-placeholder.svg')}
                        alt="Logo"
                    />
                </Link>

                <nav
                    className="max-md:hidden"
                    aria-label="primary">
                    <Menu
                        items={mainMenu}
                        menuClass="site-header__menu is-dropdown gap-x-9 flex"
                        submenuClass="top-full min-w-50 bg-black p-5 text-white"
                    />
                </nav>

                <Hamburger />
            </div>
        </header>
    );
};

export default SiteHeader;
