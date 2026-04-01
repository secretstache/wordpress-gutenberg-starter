import { Component } from '../utils/component.js';
import { Backdrop } from '../utils/backdrop.js';
import { FocusTrap } from '../utils/focus-trap.js';
import { Scrollbar } from '../utils/scrollbar.js';

const SELECTOR_DIALOG = '.modal__wrapper';
const SELECTOR_BODY = '.modal__body';
const SELECTOR_TOGGLE = '.js-modal-toggle';

export class Modal extends Component {
    static defaults = {
        backdrop: true, // true | false | 'static'
        keyboard: true,
        focus: true,
    };

    constructor(element, options = {}) {
        const elOptions = {};
        if (element.dataset.backdrop !== undefined) {
            elOptions.backdrop = element.dataset.backdrop === 'static' ? 'static' : element.dataset.backdrop !== 'false';
        }
        if (element.dataset.keyboard !== undefined) elOptions.keyboard = element.dataset.keyboard !== 'false';
        if (element.dataset.focus !== undefined) elOptions.focus = element.dataset.focus !== 'false';

        super(element, { ...elOptions, ...options });

        this._dialog = element.querySelector(SELECTOR_DIALOG);
        this._modalBody = this._dialog?.querySelector(SELECTOR_BODY) ?? null;
        this._backdrop = new Backdrop({
            isVisible: Boolean(this.options.backdrop),
            isAnimated: true,
            clickCallback: () => {
                if (this.options.backdrop === 'static') {
                    this.emit('modal:hide-prevented');
                    this._shakeModal();

                    return;
                }
                this.hide();
            },
        });
        this._focusTrap = new FocusTrap(element);
        this._scrollbar = new Scrollbar();
        this._isShown = false;
        this._isTransitioning = false;

        this._setupListeners();
    }

    toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
        if (this._isShown || this._isTransitioning) return;

        if (!this.emit('modal:show', { relatedTarget })) return;

        this._isShown = true;
        this._isTransitioning = true;

        this._scrollbar.hide();
        document.body.classList.add('modal-open');
        this._adjustDialog();

        this._backdrop.show(() => this._showElement(relatedTarget));
    }

    hide() {
        if (!this._isShown || this._isTransitioning) return;

        if (!this.emit('modal:hide')) return;

        this._isShown = false;
        this._isTransitioning = true;

        this._focusTrap.deactivate();
        this.el.classList.remove('show');

        this._afterTransition(this._dialog ?? this.el, () => this._hideModal());
    }

    destroy() {
        this._backdrop.dispose();
        this._focusTrap.deactivate();
        super.destroy();
    }

    _setupListeners() {
        // Keyboard: Escape closes (or shakes for static backdrop)
        this.on(this.el, 'keydown', (event) => {
            if (event.key !== 'Escape') return;

            if (this.options.keyboard) {
                this.hide();
            } else {
                this.emit('modal:hide-prevented');
                this._shakeModal();
            }
        });

        // Resize: re-adjust padding — rAF coalesces rapid resize events to one layout read per frame.
        let resizeFrame = null;
        this.on(window, 'resize', () => {
            if (!this._isShown || this._isTransitioning) return;
            if (resizeFrame) cancelAnimationFrame(resizeFrame);
            resizeFrame = requestAnimationFrame(() => {
                resizeFrame = null;
                this._adjustDialog();
            });
        });

        // Click on backdrop area (element itself, not dialog) — track mousedown+click
        // to avoid closing when a drag starts inside and ends outside.
        // Merged with dismiss-trigger check into one listener.
        let mousedownTarget = null;
        this.on(this.el, 'mousedown', (e) => {
            mousedownTarget = e.target;
        });
        this.on(this.el, 'click', (e) => {
            if (e.target.closest('[data-dismiss="modal"]')) {
                this.hide();

                return;
            }

            if (mousedownTarget === this.el && e.target === this.el) {
                if (this.options.backdrop === 'static') {
                    this.emit('modal:hide-prevented');
                    this._shakeModal();
                } else if (this.options.backdrop) {
                    this.hide();
                }
            }
        });
    }

    _showElement(relatedTarget) {
        if (!document.body.contains(this.el)) {
            document.body.append(this.el);
        }

        this.el.style.display = 'block';
        this.el.removeAttribute('aria-hidden');
        this.el.setAttribute('aria-modal', 'true');
        this.el.setAttribute('role', 'dialog');
        this.el.scrollTop = 0;

        if (this._modalBody) this._modalBody.scrollTop = 0;

        this.el.offsetHeight; // force reflow so transition starts

        this.el.classList.add('show');

        this._afterTransition(this._dialog ?? this.el, () => {
            if (this.options.focus) this._focusTrap.activate();
            this._isTransitioning = false;
            this.emit('modal:shown', { relatedTarget });
        });
    }

    _hideModal() {
        this.el.style.display = 'none';
        this.el.setAttribute('aria-hidden', 'true');
        this.el.removeAttribute('aria-modal');
        this.el.removeAttribute('role');
        this._isTransitioning = false;

        this._backdrop.hide(() => {
            document.body.classList.remove('modal-open');
            this._resetAdjustments();
            this._scrollbar.restore();
            this.emit('modal:hidden');
        });
    }

    _shakeModal() {
        this.el.classList.add('modal-static');
        this._afterTransition(this._dialog ?? this.el, () => {
            this.el.classList.remove('modal-static');
        });
        this.el.focus();
    }

    _adjustDialog() {
        const isModalOverflowing = this.el.scrollHeight > document.documentElement.clientHeight;
        const scrollbarWidth = this._scrollbar.getWidth();
        const isBodyOverflowing = scrollbarWidth > 0;

        this.el.style.paddingRight = isBodyOverflowing && !isModalOverflowing ? `${scrollbarWidth}px` : '';
        this.el.style.paddingLeft = !isBodyOverflowing && isModalOverflowing ? `${scrollbarWidth}px` : '';
    }

    _resetAdjustments() {
        this.el.style.paddingLeft = '';
        this.el.style.paddingRight = '';
    }
}

// Wire up [data-target] toggle buttons via event delegation.
document.addEventListener('click', (event) => {
    const trigger = event.target.closest(SELECTOR_TOGGLE);
    if (!trigger) return;

    if (
        [
            'A',
            'AREA',
        ].includes(trigger.tagName)
    )
        event.preventDefault();

    const targetSelector = trigger.dataset.target || trigger.getAttribute('href');
    if (!targetSelector) return;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    // Close any other open modal first.
    const open = document.querySelector('.modal.show');
    if (open && open !== target) Modal.getInstance(open)?.hide();

    const modal = Modal.getOrCreate(target);
    modal.toggle(trigger);

    // Restore focus to the trigger once the modal closes.
    target.addEventListener(
        'modal:hidden',
        () => {
            if (document.body.contains(trigger)) trigger.focus();
        },
        { once: true },
    );
});
