import { gsap } from '../libs/gsap';
import { Component } from '../utils/component.js';

const CURSOR_CLASS = 'cursor';
const SPEED = 0.35;

export class Cursor extends Component {
    constructor(element, options = {}) {
        super(element, options);

        // Skip the cursor on devices that prefer reduced motion.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let cursor = element.querySelector(`.${CURSOR_CLASS}`);

        if (!cursor) {
            cursor = document.createElement('div');
            cursor.classList.add(CURSOR_CLASS);
            element.appendChild(cursor);
        }

        this._cursor = cursor;
        this._pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this._mouse = { x: this._pos.x, y: this._pos.y };

        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        this._xSet = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3' });
        this._ySet = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3' });

        this._tickerFn = this._tick.bind(this);
        gsap.ticker.add(this._tickerFn);

        this.on(window, 'pointermove', this._onPointerMove.bind(this));
    }

    destroy() {
        if (this._tickerFn) {
            gsap.ticker.remove(this._tickerFn);
            this._tickerFn = null;
        }

        super.destroy();
    }

    _onPointerMove(e) {
        this._mouse.x = e.x;
        this._mouse.y = e.y;
    }

    _tick() {
        const dt = 1.0 - Math.pow(1.0 - SPEED, gsap.ticker.deltaRatio());
        this._pos.x += (this._mouse.x - this._pos.x) * dt;
        this._pos.y += (this._mouse.y - this._pos.y) * dt;
        this._xSet(this._pos.x);
        this._ySet(this._pos.y);
    }
}
