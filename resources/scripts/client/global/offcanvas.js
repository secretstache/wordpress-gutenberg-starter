import { BaseComponent } from '../utils/base-component';
import { EventHandler } from '../utils/dom/event-handler';
import { Backdrop } from '../utils/backdrop';
import { enableDismissTrigger } from '../utils/enable-dismiss-trigger';
import { FocusTrap } from '../utils/focus-trap';
import { ScrollbarHelper } from '../utils/scrollbar-helper';
import { isDisabled, isVisible } from '../utils/utilities';

/**
 * Constants
 */

const NAME = 'offcanvas';
const DATA_KEY = 'ssm.offcanvas';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const ESCAPE_KEY = 'Escape';

const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_SHOWING = 'showing';
const CLASS_NAME_HIDING = 'hiding';
const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
const OPEN_SELECTOR = '.offcanvas.show';

const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;

const SELECTOR_DATA_TOGGLE = '[aria-controls="offcanvas"]';

const Config = {
    backdrop: true,
    keyboard: true,
    scroll: false,
};

/**
 * Class definition
 */

export class Offcanvas extends BaseComponent {
    constructor(element, config) {
        super(element, config);

        this._isShown = false;
        this._backdrop = this._initializeBackDrop();
        this._focustrap = this._initializeFocusTrap();
        this._addEventListeners();
    }

    // Getters
    static get Default() {
        return Config;
    }

    static get NAME() {
        return NAME;
    }

    // Public
    toggle(relatedTarget) {
        return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
        if (this._isShown) {
            return;
        }

        const showEvent = EventHandler.trigger(this._element, EVENT_SHOW, { relatedTarget });

        if (showEvent.defaultPrevented) {
            return;
        }

        this._isShown = true;
        this._backdrop.show();

        if (!this._config.scroll) {
            new ScrollbarHelper().hide();
        }

        this._element.setAttribute('aria-modal', true);
        this._element.setAttribute('role', 'dialog');
        this._element.classList.add(CLASS_NAME_SHOWING);

        const completeCallBack = () => {
            if (!this._config.scroll || this._config.backdrop) {
                this._focustrap.activate();
            }

            this._element.classList.add(CLASS_NAME_SHOW);
            this._element.classList.remove(CLASS_NAME_SHOWING);
            EventHandler.trigger(this._element, EVENT_SHOWN, { relatedTarget });
        };

        this._queueCallback(completeCallBack, this._element, true);

        document.querySelectorAll(SELECTOR_DATA_TOGGLE).forEach((item) => {
            item.setAttribute('aria-expanded', true);
        });
    }

    hide() {
        if (!this._isShown) {
            return;
        }

        const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

        if (hideEvent.defaultPrevented) {
            return;
        }

        this._focustrap.deactivate();
        this._element.blur();
        this._isShown = false;
        this._element.classList.add(CLASS_NAME_HIDING);
        this._backdrop.hide();

        const completeCallback = () => {
            this._element.classList.remove(CLASS_NAME_SHOW, CLASS_NAME_HIDING);
            this._element.removeAttribute('aria-modal');
            this._element.removeAttribute('role');

            if (!this._config.scroll) {
                new ScrollbarHelper().reset();
            }

            EventHandler.trigger(this._element, EVENT_HIDDEN);
        };

        this._queueCallback(completeCallback, this._element, true);

        document.querySelectorAll(SELECTOR_DATA_TOGGLE).forEach((item) => {
            item.setAttribute('aria-expanded', false);
        });
    }

    dispose() {
        this._backdrop.dispose();
        this._focustrap.deactivate();
        super.dispose();
    }

    // Private
    _initializeBackDrop() {
        const clickCallback = () => {
            if (this._config.backdrop === 'static') {
                EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);

                return;
            }

            this.hide();
        };

        // 'static' option will be translated to true, and booleans will keep their value
        const isVisible = Boolean(this._config.backdrop);

        return new Backdrop({
            className: CLASS_NAME_BACKDROP,
            isVisible,
            isAnimated: true,
            rootElement: this._element.parentNode,
            clickCallback: isVisible ? clickCallback : null,
        });
    }

    _initializeFocusTrap() {
        return new FocusTrap({
            trapElement: this._element,
        });
    }

    _addEventListeners() {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event) => {
            if (event.key !== ESCAPE_KEY) {
                return;
            }

            if (this._config.keyboard) {
                this.hide();

                return;
            }

            EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
        });
    }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    const target = document.querySelector('#' + this.getAttribute('aria-controls'));

    if (
        [
            'A',
            'AREA',
        ].includes(this.tagName)
    ) {
        event.preventDefault();
    }

    if (isDisabled(this)) {
        return;
    }

    EventHandler.one(target, EVENT_HIDDEN, () => {
        // focus on trigger when it is closed
        if (isVisible(this)) {
            this.focus();
        }
    });

    // avoid conflict when clicking a toggler of an offcanvas, while another is open
    const alreadyOpen = document.querySelector(OPEN_SELECTOR);
    if (alreadyOpen && alreadyOpen !== target) {
        Offcanvas.getInstance(alreadyOpen).hide();
    }

    const data = Offcanvas.getOrCreateInstance(target);
    data.toggle(this);
});

enableDismissTrigger(Offcanvas);
