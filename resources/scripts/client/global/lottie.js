import '@lottiefiles/lottie-player';
import { Component } from '../utils/component.js';

const LOADED_CLASS = 'is-loaded';
const LOADING_CLASS = 'loading';
const PARENT_CLASS = 'has-lottie';

// One shared observer for all instances — more efficient than one per player.
let _observer = null;
let _refCount = 0;

function getObserver() {
    if (!_observer) {
        _observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const instance = LottieAnimation.getInstance(entry.target);
                    if (!instance) return;

                    if (entry.isIntersecting) {
                        instance.el.play();
                    } else {
                        instance.el.stop();
                    }
                });
            },
            { rootMargin: '-50% 0% -50% 0%' },
        );
    }

    _refCount++;

    return _observer;
}

function releaseObserver() {
    _refCount--;
    if (_refCount === 0 && _observer) {
        _observer.disconnect();
        _observer = null;
    }
}

export class LottieAnimation extends Component {
    constructor(element, options = {}) {
        super(element, options);

        this._loader = null;
        this._isObserved = false;

        const parent = element.parentElement;
        if (parent) {
            parent.classList.add(PARENT_CLASS);
            this._loader = parent.querySelector(`.${LOADING_CLASS}`);

            if (!this._loader) {
                this._loader = document.createElement('div');
                this._loader.classList.add(LOADING_CLASS);
                parent.appendChild(this._loader);
            }
        }

        const src = element.getAttribute('data-src') || element.getAttribute('src');

        if (src) {
            element
                .load(src)
                .then(() => {
                    element.removeAttribute('data-src');
                    element.classList.add(LOADED_CLASS);
                    this._loader?.remove();
                    this._loader = null;
                    element.stop();
                    getObserver().observe(element);
                    this._isObserved = true;
                })
                .catch((err) => console.error('[LottieAnimation] Failed to load:', src, err));
        }
    }

    destroy() {
        if (this._isObserved) {
            getObserver().unobserve(this.el);
            releaseObserver();
        }
        super.destroy();
    }
}
