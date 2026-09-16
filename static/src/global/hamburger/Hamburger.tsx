import { cn } from '@lib/cn';

export interface HamburgerProps {
    controls?: string;
    expanded?: boolean;
    className?: string;
}

export const Hamburger = ({ controls, expanded, className }: HamburgerProps) => {
    return (
        <button
            className={cn('hamburger cursor-pointer group/hamburger flex items-center gap-x-1 rounded-lg transition-colors', className)}
            type="button"
            aria-label="Open navigation menu"
            aria-controls={controls}
            aria-expanded={expanded}>
            <div className="relative w-5 h-3.5">
                <span
                    aria-hidden="true"
                    className="sr-only">
                    Menu toggle
                </span>
                <span className="block absolute top-0 w-full h-0.5 bg-black transition-transform duration-300 ease-in-out group-[&[aria-expanded='true']]/hamburger:rotate-45 group-[&[aria-expanded='true']]/hamburger:translate-y-[0.313rem]" />
                <span className="block absolute top-1/2 -translate-y-1/2 w-full h-0.5 bg-black transition-all duration-300 ease-in-out group-[&[aria-expanded='true']]/hamburger:opacity-0 group-[&[aria-expanded='true']]/hamburger:-translate-x-full" />
                <span className="block absolute bottom-0 w-full h-0.5 bg-black transition-transform duration-300 ease-in-out group-[&[aria-expanded='true']]/hamburger:-rotate-45 group-[&[aria-expanded='true']]/hamburger:translate-y-[-0.438rem]" />
            </div>
        </button>
    );
};

export default Hamburger;
