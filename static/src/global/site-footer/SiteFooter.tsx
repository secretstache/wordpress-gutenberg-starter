import { Menu } from '@global/menu/Menu';
import { mainMenu } from '@data/navigation';

export const SiteFooter = (): JSX.Element => {
    return (
        <footer className="bg-black text-white">
            <div className="container">
                <Menu
                    items={mainMenu}
                    menuClass="flex flex-col"
                />
            </div>
        </footer>
    );
};

export default SiteFooter;
