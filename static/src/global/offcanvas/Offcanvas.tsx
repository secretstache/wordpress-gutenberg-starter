import { Hamburger } from '@global/hamburger/Hamburger';
import { Menu } from '@global/menu/Menu';
import { offcanvasMenu } from '@data/navigation';

export interface OffcanvasProps {
    isOpen?: boolean;
}

export const Offcanvas = ({ isOpen = false }: OffcanvasProps) => {
    return (
        <div
            className={`offcanvas group/offcanvas w-full h-full overflow-y-auto overflow-x-hidden bg-white [&.show]:translate-y-0 [&.show]:opacity-100 [&.show]:pointer-events-auto -translate-y-full transition-all ease-linear duration-300 pointer-events-none opacity-0 fixed left-0 top-0 z-1000 px-container-padding ${isOpen ? ' show' : ''}`}
            id="offcanvas"
            aria-label="offcanvas"
            aria-modal="true"
            role="dialog"
            inert={!isOpen || undefined}>
            <div className="container relative h-full mx-auto">
                <div className="offcanvas-header flex items-center pt-6 pb-8">
                    <Hamburger
                        label="Close navigation menu"
                        dismiss="offcanvas"
                        open={true}
                        className="ml-auto"
                    />
                </div>

                <nav aria-label="mobile">
                    <Menu
                        items={offcanvasMenu}
                        className="gap-y-4 text-center"
                        variant="vertical"
                    />
                </nav>
            </div>
        </div>
    );
};

export default Offcanvas;
