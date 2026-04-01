import { Component } from '../utils/component.js';

const ANIMATED_CLASS = 'is-animated';

let _observer = null;

function getObserver() {
    if (!_observer) {
        _observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add(ANIMATED_CLASS);
                    _observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0,
                rootMargin: '-50% 0% -50% 0%',
            },
        );
    }

    return _observer;
}

export class Animation extends Component {
    constructor(element, options = {}) {
        super(element, options);
        getObserver().observe(element);
    }

    destroy() {
        getObserver().unobserve(this.el);
        super.destroy();
    }
}
