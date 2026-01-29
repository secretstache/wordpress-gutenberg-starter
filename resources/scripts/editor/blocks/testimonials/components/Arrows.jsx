export const Arrows = () => {
    return (
        <div className="splide__arrows md:absolute md:bottom-0 md:left-0 flex gap-1.5 z-10 max-md:mt-8">
            <button className="splide__arrow splide__arrow--prev flex items-center justify-center w-13 h-13 border-2 border-charcoal text-charcoal cursor-pointer hover:bg-burnt-orange hover:text-white hover:border-burnt-orange dark:border-white dark:text-white dark:hover:text-charcoal dark:hover:bg-white transition-colors">
                <div className="sr-only">Prev</div>
                <svg aria-hidden="true" width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.6123 9.28571L2.62595 5.29936L6.6123 1.313L5.29931 -5.7393e-08L-5.17301e-05 5.29936L5.2993 10.5987L6.6123 9.28571Z" fill="currentColor"/></svg>
            </button>
            
            <button className="splide__arrow splide__arrow--next flex items-center justify-center w-13 h-13 border-2 border-charcoal text-charcoal cursor-pointer hover:bg-burnt-orange hover:text-white hover:border-burnt-orange dark:border-white dark:text-white dark:hover:text-charcoal dark:hover:bg-white transition-colors"><div className="sr-only">Next</div>
                <svg aria-hidden="true"  width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.83594 7.01897L11.8223 11.0053L7.83594 14.9917L9.14894 16.3047L14.4483 11.0053L9.14894 5.70597L7.83594 7.01897Z" fill="currentColor"/></svg>
            </button>
        </div>
    );
}