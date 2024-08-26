import { throttle } from '../utils/utilities';

const STICKY_CLASS = 'sticky';

export const Header = (header) => {
    const sticky = 0;

    const stickyHeader = () => {
        if (window.scrollY > sticky) {
            header.classList.add(STICKY_CLASS);
        } else {
            header.classList.remove(STICKY_CLASS);
        }
    };

    stickyHeader();

    const scrollCallback = throttle(stickyHeader, 100);
    window.addEventListener('scroll', scrollCallback);
};
