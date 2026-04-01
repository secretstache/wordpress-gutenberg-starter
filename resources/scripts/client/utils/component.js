/**
 * Component — base class for all interactive components.
 *
 * Provides:
 *  - WeakMap-based instance registry (getInstance / getOrCreate)
 *  - Tracked event listeners auto-cleaned on destroy()
 *  - CustomEvent dispatch with cancelable support (emit)
 *  - Transition-aware callback helper (_afterTransition)
 */

const registries = new Map();
const getRegistry = (Constructor) => {
    if (!registries.has(Constructor)) registries.set(Constructor, new WeakMap());
    return registries.get(Constructor);
};

export class Component {
    static defaults = {};

    constructor(element, options = {}) {
        this.el = element;
        this.options = { ...this.constructor.defaults, ...options };
        this._handlers = [];
        getRegistry(this.constructor).set(element, this);
    }

    /**
     * Add a tracked event listener that is automatically removed on destroy().
     * @param {EventTarget} el
     * @param {string} type
     * @param {EventListener} handler
     * @param {AddEventListenerOptions} [options]
     */
    on(el, type, handler, options) {
        el.addEventListener(type, handler, options);
        this._handlers.push({ el, type, handler, options });
    }

    /**
     * Dispatch a CustomEvent on this.el.
     * Returns false if the event was cancelled (preventDefault called).
     * @param {string} type
     * @param {object} [detail]
     * @returns {boolean}
     */
    emit(type, detail = {}) {
        return this.el.dispatchEvent(new CustomEvent(type, { bubbles: true, cancelable: true, detail }));
    }

    /**
     * Remove all tracked listeners and unregister from the instance registry.
     */
    destroy() {
        this._handlers.forEach(({ el, type, handler, options }) => el.removeEventListener(type, handler, options));
        this._handlers = [];
        getRegistry(this.constructor).delete(this.el);
    }

    /**
     * Execute a callback after the CSS transition on `el` completes.
     * Falls back to a timeout if no transitionend fires.
     * @param {HTMLElement} el
     * @param {() => void} callback
     */
    _afterTransition(el, callback) {
        const { transitionDuration, transitionDelay } = getComputedStyle(el);
        const duration = (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * 1000 + 5;

        let called = false;

        const handler = ({ target }) => {
            if (target !== el) return;
            called = true;
            el.removeEventListener('transitionend', handler);
            callback();
        };

        el.addEventListener('transitionend', handler);
        setTimeout(() => {
            if (!called) {
                el.removeEventListener('transitionend', handler);
                callback();
            }
        }, duration);
    }

    /**
     * @param {Element} el
     * @returns {Component|null}
     */
    static getInstance(el) {
        return getRegistry(this).get(el) ?? null;
    }

    /**
     * @param {Element} el
     * @param {object} [options]
     * @returns {Component}
     */
    static getOrCreate(el, options) {
        return this.getInstance(el) ?? new this(el, options);
    }
}
