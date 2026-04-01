import { Component } from '../utils/component.js';
import { Backdrop } from '../utils/backdrop.js';
import { FocusTrap } from '../utils/focus-trap.js';
import { Scrollbar } from '../utils/scrollbar.js';

const SELECTOR_TOGGLE = '[aria-controls="offcanvas"]';

export class Offcanvas extends Component {
    static defaults = {
        backdrop: true, // true | false | 'static'
        keyboard: true,
        scroll: false,
    };

    constructor(element, options = {}) {
        super(element, options);

        this._isShown = false;
        this._scrollbar = new Scrollbar();
        this._focusTrap = new FocusTrap(element);
        this._backdrop = new Backdrop({
            className: 'offcanvas-backdrop',
            isVisible: Boolean(this.options.backdrop),
            isAnimated: true,
            rootElement: element.parentNode ?? document.body,
            clickCallback: () => {
                if (this.options.backdrop === 'static') {
                    this.emit('offcanvas:hide-prevented');

                    return;
                }
                this.hide();
            },
        });

        this._setupListeners();
    }

    toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
        if (this._isShown) return;

        if (!this.emit('offcanvas:show', { relatedTarget })) return;

        this._isShown = true;

        if (!this.options.scroll) this._scrollbar.hide();

        this._backdrop.show();

        this.el.setAttribute('aria-modal', 'true');
        this.el.setAttribute('role', 'dialog');
        this.el.removeAttribute('inert');
        this.el.classList.add('showing');

        this._afterTransition(this.el, () => {
            if (!this.options.scroll || this.options.backdrop) {
                this._focusTrap.activate();
            }

            this.el.classList.replace('showing', 'show');
            this.emit('offcanvas:shown', { relatedTarget });
        });

        this._toggleButtons.forEach((el) => el.setAttribute('aria-expanded', 'true'));
    }

    hide() {
        if (!this._isShown) return;

        if (!this.emit('offcanvas:hide')) return;

        this._focusTrap.deactivate();
        this.el.blur();
        this._isShown = false;
        this.el.classList.add('hiding');
        this._backdrop.hide();

        this._afterTransition(this.el, () => {
            this.el.classList.remove('show', 'hiding');
            this.el.removeAttribute('aria-modal');
            this.el.removeAttribute('role');
            this.el.setAttribute('inert', '');

            if (!this.options.scroll) this._scrollbar.restore();

            this.emit('offcanvas:hidden');
        });

        this._toggleButtons.forEach((el) => el.setAttribute('aria-expanded', 'false'));
    }

    destroy() {
        this._backdrop.dispose();
        this._focusTrap.deactivate();
        super.destroy();
    }

    // Lazily cached — queried once on first show/hide, not on every call.
    get _toggleButtons() {
        return (this._toggleButtonsCache ??= [...document.querySelectorAll(SELECTOR_TOGGLE)]);
    }

    _setupListeners() {
        this.on(this.el, 'keydown', (event) => {
            if (event.key !== 'Escape') return;

            if (this.options.keyboard) {
                this.hide();
            } else {
                this.emit('offcanvas:hide-prevented');
            }
        });

        this.on(this.el, 'click', (e) => {
            if (e.target.closest('[data-dismiss="offcanvas"]')) this.hide();
        });
    }
}

// Wire up [aria-controls] toggle buttons via event delegation.
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

    const targetId = trigger.getAttribute('aria-controls');
    const target = document.getElementById(targetId);
    if (!target) return;

    // Close any other open offcanvas first.
    const open = document.querySelector('.offcanvas.show');
    if (open && open !== target) Offcanvas.getInstance(open)?.hide();

    const offcanvas = Offcanvas.getOrCreate(target);
    offcanvas.toggle(trigger);

    // Restore focus to the trigger once the offcanvas closes.
    target.addEventListener(
        'offcanvas:hidden',
        () => {
            if (document.body.contains(trigger)) trigger.focus();
        },
        { once: true },
    );
});
