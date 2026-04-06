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
                    <button
                        className="close-button ml-auto cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                        type="button"
                        aria-label="Close navigation menu"
                        data-dismiss="offcanvas">
                        <span aria-hidden="true" className="block relative w-5 h-5">
                            <span className="block absolute top-1/2 left-0 w-full h-0.5 bg-black rotate-45 -translate-y-1/2" />
                            <span className="block absolute top-1/2 left-0 w-full h-0.5 bg-black -rotate-45 -translate-y-1/2" />
                        </span>
                    </button>
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
