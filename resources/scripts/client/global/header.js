import { Component } from '../utils/component.js';

const STICKY_THRESHOLD = 0;

export class Header extends Component {
    constructor(element, options = {}) {
        super(element, options);

        this._lastScrollTop = 0;
        this._headerHeight = element.offsetHeight;

        this.on(window, 'scroll', this._handleScroll.bind(this), { passive: true });

        this._resizeObserver = new ResizeObserver(() => {
            this._headerHeight = element.offsetHeight;
        });
        this._resizeObserver.observe(element);

        this._handleScroll();
    }

    destroy() {
        this._resizeObserver.disconnect();
        super.destroy();
    }

    _handleScroll() {
        const scrollTop = Math.max(0, window.scrollY);

        this.el.classList.toggle('is-sticky', scrollTop > STICKY_THRESHOLD);

        if (scrollTop > this._lastScrollTop && scrollTop >= this._headerHeight) {
            this.el.classList.add('is-scrolling-down');
        } else {
            this.el.classList.remove('is-scrolling-down');
        }

        this._lastScrollTop = scrollTop;
    }
}
