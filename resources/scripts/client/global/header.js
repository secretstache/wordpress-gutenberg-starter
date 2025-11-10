import { throttle } from '../utils/utilities';

const CLASSES = {
    scrolling_down: 'is-scrolling-down',
    sticky: 'is-sticky',
};

export const Header = (header) => {
    if (!header) return () => {};

    const headerScrollingClass = toggleScrollingClass(header);
    const headerStickyClass = toggleStickyClass(header);

    // Return combined cleanup function
    return () => {
        headerScrollingClass.cleanup();
        headerStickyClass.cleanup();
    };
};

const toggleScrollingClass = (header) => {
    let lastScrollTop = 0;
    const siteHeaderHeight = header.offsetHeight;

    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Determine scroll direction and check against header height
        if (scrollTop > lastScrollTop && scrollTop >= siteHeaderHeight) {
            // Scrolling down and past header height - add class
            header.classList.add(CLASSES.scrolling_down);
        } else {
            // Scrolling up or not past header height - remove class
            header.classList.remove(CLASSES.scrolling_down);
        }

        // Update scroll position
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });

    return {
        cleanup: () => {
            window.removeEventListener('scroll', handleScroll);
        },
    };
};

const toggleStickyClass = (header) => {
    const sticky = 0;

    const stickyHeader = () => {
        if (window.scrollY > sticky) {
            header.classList.add(CLASSES.sticky);
        } else {
            header.classList.remove(CLASSES.sticky);
        }
    };

    stickyHeader();

    const scrollCallback = throttle(stickyHeader, 100);
    window.addEventListener('scroll', scrollCallback);

    return {
        cleanup: () => {
            window.removeEventListener('scroll', scrollCallback);
        },
    };
};
