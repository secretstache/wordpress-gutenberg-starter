import { gsap } from '../libs/gsap';

const CURSOR_CLASS = 'cursor';

export const Cursor = () => {
    let cursor = document.querySelector(`.${CURSOR_CLASS}`);

    if (!cursor) {
        cursor = document.createElement('div');
        cursor.classList.add(CURSOR_CLASS);
        document.body.appendChild(cursor);
    }

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.35;

    const xSet = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3' });
    const ySet = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3' });

    window.addEventListener('pointermove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());

        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;
        xSet(pos.x);
        ySet(pos.y);
    });

    return cursor;
};
