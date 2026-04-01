import { Menu } from '@global/menu/Menu';
import { offcanvasMenu } from '@data/navigation';

export interface OffcanvasProps {
    isOpen?: boolean;
}

export const Offcanvas = ({ isOpen = false }: OffcanvasProps) => {
    return (
        <div
            className={`offcanvas group overflow-y-auto overflow-x-hidden bg-white [&.show]:translate-y-0 [&.show]:opacity-100 [&.show]:pointer-events-auto w-full -translate-y-full transition-all ease-linear duration-300 pointer-events-none opacity-0 fixed right-0 z-[1000] h-full${isOpen ? ' show' : ''}`}
            id="offcanvas"
            aria-label="offcanvas"
            aria-modal="true"
            role="dialog"
            inert={!isOpen || undefined}>
            <div className="container relative h-full px-5 mx-auto">
                <div className="offcanvas-header flex items-center pt-6 pb-8">
                    <button
                        className="hamburger ml-auto cursor-pointer group flex items-center gap-x-1 rounded-lg transition-colors"
                        type="button"
                        aria-label="Close navigation menu"
                        data-dismiss="offcanvas">
                        <div className="relative w-5 h-[0.875rem]">
                            <span
                                aria-hidden="true"
                                className="sr-only">
                                Menu toggle
                            </span>
                            <span className="block absolute top-0 w-full h-[0.125rem] bg-black transition-transform duration-300 ease-in-out rotate-45 translate-y-[0.313rem]" />
                            <span className="block absolute bottom-0 w-full h-[0.125rem] bg-black transition-transform duration-300 ease-in-out -rotate-45 translate-y-[-0.438rem]" />
                        </div>
                    </button>
                </div>

                <nav aria-label="mobile">
                    <Menu
                        items={offcanvasMenu}
                        menuClass="flex flex-col"
                    />
                </nav>
            </div>
        </div>
    );
};

export default Offcanvas;
