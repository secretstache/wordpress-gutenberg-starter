/**
 * Scrollbar — hides the page scrollbar and compensates for the layout shift
 * caused by its removal (e.g. when a modal or offcanvas is open).
 *
 * Usage:
 *   const sb = new Scrollbar();
 *   sb.hide();    // lock scroll, pad fixed elements
 *   sb.restore(); // undo everything
 */

const SELECTOR_FIXED = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top, .site-header';
const SELECTOR_STICKY = '.sticky-top';

export class Scrollbar {
    constructor() {
        // Stored as flat array of {el, prop, value} so we can iterate on restore.
        this._saved = [];
    }

    getWidth() {
        return Math.abs(window.innerWidth - document.documentElement.clientWidth);
    }

    hide() {
        const width = this.getWidth();

        this._saveAndSet(document.body, 'overflow', 'hidden');
        this._saveAndSet(document.body, 'padding-right', `${this._computedPaddingRight(document.body) + width}px`);

        document.body.querySelectorAll(SELECTOR_FIXED).forEach((el) => {
            // Skip elements narrower than the viewport — they don't shift.
            if (window.innerWidth > el.clientWidth + width) return;

            this._saveAndSet(el, 'padding-right', `${this._computedPaddingRight(el) + width}px`);
        });

        document.body.querySelectorAll(SELECTOR_STICKY).forEach((el) => {
            const current = parseFloat(getComputedStyle(el).marginRight) || 0;
            this._saveAndSet(el, 'margin-right', `${current - width}px`);
        });
    }

    restore() {
        this._saved.forEach(({ el, prop, original }) => {
            if (original === null) {
                el.style.removeProperty(prop);
            } else {
                el.style.setProperty(prop, original);
            }
        });

        this._saved = [];
    }

    _computedPaddingRight(el) {
        return parseFloat(getComputedStyle(el).paddingRight) || 0;
    }

    _saveAndSet(el, prop, value) {
        // Only save the original once per element+prop pair.
        const alreadySaved = this._saved.some((s) => s.el === el && s.prop === prop);

        if (!alreadySaved) {
            this._saved.push({ el, prop, original: el.style.getPropertyValue(prop) || null });
        }

        el.style.setProperty(prop, value);
    }
}
