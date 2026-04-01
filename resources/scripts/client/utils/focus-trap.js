/**
 * FocusTrap — keeps keyboard focus contained within a given element.
 *
 * Usage:
 *   const trap = new FocusTrap(dialogElement);
 *   trap.activate();   // begin trapping; autofocuses the element
 *   trap.deactivate(); // stop trapping
 */

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details > summary',
].join(', ');

export class FocusTrap {
    constructor(element) {
        this._element = element;
        this._isActive = false;
        this._lastTabNavBackward = false;
        this._focusinHandler = this._handleFocusin.bind(this);
        this._keydownHandler = this._handleKeydown.bind(this);
        this._focusableCache = null;
    }

    activate(autofocus = true) {
        if (this._isActive) return;

        this._focusableCache = null;

        if (autofocus) {
            this._element.focus();
        }

        document.addEventListener('focusin', this._focusinHandler);
        document.addEventListener('keydown', this._keydownHandler);
        this._isActive = true;
    }

    deactivate() {
        if (!this._isActive) return;

        this._focusableCache = null;

        document.removeEventListener('focusin', this._focusinHandler);
        document.removeEventListener('keydown', this._keydownHandler);
        this._isActive = false;
    }

    _focusableChildren() {
        return (this._focusableCache ??= [...this._element.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
            (el) => !el.closest('[hidden]') && getComputedStyle(el).visibility !== 'hidden',
        ));
    }

    _handleFocusin(event) {
        if (event.target === document || event.target === this._element || this._element.contains(event.target)) {
            return;
        }

        const focusable = this._focusableChildren();

        if (focusable.length === 0) {
            this._element.focus();
        } else if (this._lastTabNavBackward) {
            focusable[focusable.length - 1].focus();
        } else {
            focusable[0].focus();
        }
    }

    _handleKeydown(event) {
        if (event.key === 'Tab') {
            this._lastTabNavBackward = event.shiftKey;
        }
    }
}
