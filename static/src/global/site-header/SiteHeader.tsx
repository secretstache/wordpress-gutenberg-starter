import { Link } from 'react-router-dom';
import { url } from '@lib/url';
import { Hamburger } from '@global/hamburger/Hamburger';
import { Menu } from '@global/menu/Menu';
import { mainMenu } from '@data/navigation';

export const SiteHeader = (): JSX.Element => {
    return (
        <header className="site-header sticky top-0 left-0 w-full transition-all duration-300 z-50 [&.is-scrolling-down]:-translate-y-full bg-white py-3 px-container-padding">
            <div className="container flex items-center justify-between gap-x-2">
                <Link
                    to=""
                    className="flex items-center mr-auto">
                    <img
                        src={url('assets/images/cms/logo-placeholder.svg')}
                        alt="Logo"
                    />
                </Link>

                <nav
                    className="max-lg:hidden"
                    aria-label="primary">
                    <Menu
                        items={mainMenu}
                        variant="dropdown"
                        className="gap-x-9"
                        submenuClass="bg-black bg-dark p-4 min-w-50"
                    />
                </nav>

                <Hamburger
                    controls="offcanvas"
                    expanded={false}
                    className="lg:hidden"
                />
            </div>
        </header>
    );
};

export default SiteHeader;
