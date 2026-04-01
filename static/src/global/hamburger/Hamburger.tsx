export interface HamburgerProps {
    /** aria-controls value, default 'offcanvas' */
    controls?: string;
}

export const Hamburger = ({ controls = 'offcanvas' }: HamburgerProps) => {
    return (
        <button
            className="hamburger group flex items-center gap-x-4 rounded transition-colors cursor-pointer lg:hidden"
            type="button"
            aria-controls={controls}
            aria-expanded="false">
            <div className="relative w-5 h-[0.875rem]">
                <span className="sr-only">Menu toggle</span>
                <span className="block absolute top-0 w-full h-[0.125rem] rounded bg-black transition-transform duration-300 ease-in-out group-[&[aria-expanded='true']]:rotate-45 group-[&[aria-expanded='true']]:translate-y-[0.313rem]" />
                <span className="block absolute top-1/2 -translate-y-1/2 w-full h-[0.125rem] rounded bg-black transition-all duration-300 ease-in-out group-[&[aria-expanded='true']]:opacity-0 group-[&[aria-expanded='true']]:-translate-x-full" />
                <span className="block absolute bottom-0 w-full h-[0.125rem] rounded bg-black transition-transform duration-300 ease-in-out group-[&[aria-expanded='true']]:-rotate-45 group-[&[aria-expanded='true']]:translate-y-[-0.438rem]" />
            </div>
        </button>
    );
};

export default Hamburger;
