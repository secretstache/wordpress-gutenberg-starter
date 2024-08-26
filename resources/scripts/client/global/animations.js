import { inViewport } from '../utils/utilities';

const ANIMATED_CLASS = 'is-animated';
const GALLERY_SELECTOR = `.has-animation:not(.${ANIMATED_CLASS})`;

function Animations() {
    Array.from(document.querySelectorAll(GALLERY_SELECTOR)).forEach((group) => {
        inViewport(group, addAnimatedClass, { threshold: 0, rootMargin: '-50% 0% -50% 0%' });
    });
}

function addAnimatedClass(entries) {
    entries.forEach((entry) => {
        const group = entry.target;

        if (entry.isIntersecting) {
            group.classList.add(ANIMATED_CLASS);
        }
    });
}

export { Animations };
