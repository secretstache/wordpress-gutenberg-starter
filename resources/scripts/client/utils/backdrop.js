/**
 * Backdrop — managed overlay element used by modals and offcanvas.
 *
 * Usage:
 *   const bd = new Backdrop({ isVisible: true, isAnimated: true, clickCallback: () => modal.hide() });
 *   bd.show();
 *   bd.hide(() => doSomethingAfter());
 *   bd.dispose();
 */

const CLASS_FADE = 'fade';
const CLASS_SHOW = 'show';

const DEFAULTS = {
    className: 'modal-backdrop',
    isAnimated: false,
    isVisible: true,
    rootElement: document.body,
    clickCallback: null,
};

const forceReflow = (el) => void el.offsetHeight;

export class Backdrop {
    constructor(config = {}) {
        this._config = { ...DEFAULTS, ...config };
        this._element = null;
        this._isAppended = false;
        this._clickHandler = null;
    }

    show(callback) {
        if (!this._config.isVisible) {
            callback?.();
            return;
        }

        this._append();

        if (this._config.isAnimated) {
            forceReflow(this._element);
        }

        this._element.classList.add(CLASS_SHOW);
        this._afterTransition(callback);
    }

    hide(callback) {
        if (!this._config.isVisible) {
            callback?.();
            return;
        }

        this._element.classList.remove(CLASS_SHOW);
        this._afterTransition(() => {
            this.dispose();
            callback?.();
        });
    }

    dispose() {
        if (!this._isAppended) return;

        if (this._clickHandler) {
            this._element.removeEventListener('mousedown', this._clickHandler);
            this._clickHandler = null;
        }

        this._element.remove();
        this._element = null;
        this._isAppended = false;
    }

    _append() {
        if (this._isAppended) return;

        const el = document.createElement('div');
        el.className = this._config.className;

        if (this._config.isAnimated) {
            el.classList.add(CLASS_FADE);
        }

        if (this._config.clickCallback) {
            this._clickHandler = () => this._config.clickCallback();
            el.addEventListener('mousedown', this._clickHandler);
        }

        this._config.rootElement.append(el);
        this._element = el;
        this._isAppended = true;
    }

    _afterTransition(callback) {
        if (!this._config.isAnimated || !this._element) {
            callback?.();
            return;
        }

        const el = this._element;
        const { transitionDuration, transitionDelay } = getComputedStyle(el);
        const duration = (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * 1000 + 5;

        let called = false;

        const handler = ({ target }) => {
            if (target !== el) return;
            called = true;
            el.removeEventListener('transitionend', handler);
            callback?.();
        };

        el.addEventListener('transitionend', handler);
        setTimeout(() => {
            if (!called) el.dispatchEvent(new Event('transitionend'));
        }, duration);
    }
}
