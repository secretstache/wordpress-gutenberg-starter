import { cn } from '@lib/cn';

export interface HamburgerProps {
    /** aria-controls — used on the open button in the header */
    controls?: string;
    /** aria-expanded — used on the open button in the header */
    expanded?: boolean;
    /** Forces the ✕ state via a CSS class, without aria-expanded */
    open?: boolean;
    /** aria-label — used on the close button inside the offcanvas */
    label?: string;
    /** data-dismiss — used on the close button inside the offcanvas */
    dismiss?: string;
    /** Extra classes added to the root <button> (e.g. ml-auto) */
    className?: string;
}

export const Hamburger = ({ controls, expanded, open, label, dismiss, className }: HamburgerProps) => {
    return (
        <button
            className={cn('hamburger cursor-pointer group/hamburger flex items-center gap-x-1 rounded-lg transition-colors', open && 'is-open', className)}
            type="button"
            aria-label={label}
            aria-controls={controls}
            aria-expanded={expanded}
            {...(dismiss && { 'data-dismiss': dismiss })}>
            <div className="relative w-5 h-3.5">
                <span
                    aria-hidden="true"
                    className="sr-only">
                    Menu toggle
                </span>
                <span className="block absolute top-0 w-full h-0.5 bg-black transition-transform duration-300 ease-in-out group-[&[aria-expanded='true']]/hamburger:rotate-45 group-[&.is-open]/hamburger:rotate-45 group-[&[aria-expanded='true']]/hamburger:translate-y-[0.313rem] group-[&.is-open]/hamburger:translate-y-[0.313rem]" />
                <span className="block absolute top-1/2 -translate-y-1/2 w-full h-0.5 bg-black transition-all duration-300 ease-in-out group-[&[aria-expanded='true']]/hamburger:opacity-0 group-[&.is-open]/hamburger:opacity-0 group-[&[aria-expanded='true']]/hamburger:-translate-x-full group-[&.is-open]/hamburger:-translate-x-full" />
                <span className="block absolute bottom-0 w-full h-0.5 bg-black transition-transform duration-300 ease-in-out group-[&[aria-expanded='true']]/hamburger:-rotate-45 group-[&.is-open]/hamburger:-rotate-45 group-[&[aria-expanded='true']]/hamburger:translate-y-[-0.438rem] group-[&.is-open]/hamburger:translate-y-[-0.438rem]" />
            </div>
        </button>
    );
};

export default Hamburger;
