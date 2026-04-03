import { Menu } from '@global/menu/Menu';
import { footerMenu } from '@data/navigation';

export const SiteFooter = (): JSX.Element => {
    return (
        <footer className="bg-black bg-dark px-container-padding py-6">
            <div className="container">
                <Menu
                    items={footerMenu}
                    variant="horizontal"
                    className="gap-x-4"
                />
            </div>
        </footer>
    );
};

export default SiteFooter;
