import { Component } from '../utils/component.js';

let _nextId = 0;
const nextId = () => ++_nextId;

const COLLAPSE_DELAY = 300;
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';

const ARROW_SVG = `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 30.727 30.727"><path fill="currentColor" d="M29.994,10.183L15.363,24.812L0.733,10.184c-0.977-0.978-0.977-2.561,0-3.536c0.977-0.977,2.559-0.976,3.536,0l11.095,11.093L26.461,6.647c0.977-0.976,2.559-0.976,3.535,0C30.971,7.624,30.971,9.206,29.994,10.183z"/></svg>`;

export class DropdownMenu extends Component {
    static defaults = {
        useArrowKeys: true,
        withArrowButton: true,
        topLevelClickable: false,
    };

    constructor(element, options = {}) {
        super(element, options);

        this._openIndex = null;
        this._topLevelNodes = [...element.children];
        this._topLevelButtons = [];
        this._submenus = [];
        this._timers = new Array(this._topLevelNodes.length).fill(null);

        this._topLevelNodes.forEach((node) => this._initNode(node));

        // Cached once — menu structure doesn't change at runtime.
        this._topLevelFocusable = this._topLevelNodes.flatMap((node) =>
            [...node.children].filter((c) => c.tagName === 'A' || c.tagName === 'BUTTON'),
        );

        // Two delegated mouse listeners replace 2N individual mouseover/mouseout listeners.
        // relatedTarget boundary check emulates mouseenter/mouseleave semantics (no spurious
        // firings when the pointer moves between child elements within the same node).
        this.on(element, 'mouseover', (e) => {
            const me = /** @type {MouseEvent} */ (e);
            const index = this._nodeIndexOf(/** @type {Element} */ (me.target));
            if (index !== -1 && !this._topLevelNodes[index].contains(me.relatedTarget)) {
                this._toggleExpand(index, true);
            }
        });

        this.on(element, 'mouseout', (e) => {
            const me = /** @type {MouseEvent} */ (e);
            const index = this._nodeIndexOf(/** @type {Element} */ (me.target));
            if (index !== -1 && !this._topLevelNodes[index].contains(me.relatedTarget)) {
                this._toggleExpand(index, false);
            }
        });

        // Single delegated keydown replaces 1 root + N button + N submenu listeners.
        this.on(element, 'keydown', this._onKeyDown.bind(this));

        // Single delegated click prevents default on arrow buttons (replaces N listeners).
        this.on(element, 'click', (e) => {
            if (e.target instanceof Element && e.target.closest('.dropdown-arrow')) e.preventDefault();
        });

        this.on(element, 'focusout', this._onBlur.bind(this));
    }

    destroy() {
        this._timers.forEach((t) => t && clearTimeout(t));
        super.destroy();
    }

    // Returns the index of the top-level node that contains `target`, or -1.
    _nodeIndexOf(target) {
        return this._topLevelNodes.findIndex((node) => node.contains(target));
    }

    _initNode(node) {
        const submenu = node.querySelector('ul');

        if (this.options.withArrowButton && submenu && !node.querySelector('.dropdown-arrow')) {
            const link = node.querySelector('a');
            const id = nextId();

            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', `dropdown-${id}`);
            button.setAttribute('aria-label', `More ${link?.textContent.trim() ?? ''} pages`);
            button.className = 'dropdown-arrow';
            button.innerHTML = ARROW_SVG;

            if (!submenu.id) submenu.id = `dropdown-${id}`;
            link?.insertAdjacentElement('afterend', button);
        }

        const button = node.querySelector('button') ?? node.querySelector('a');

        this._submenus.push(submenu ?? null);
        this._topLevelButtons.push(button);

        if (button && submenu) {
            button.setAttribute('aria-expanded', 'false');
        }
    }

    // Single entry point for all keydown events — routes to the right handler.
    _onKeyDown(event) {
        const submenuIndex = this._submenus.findIndex((s) => s?.contains(event.target));

        if (submenuIndex !== -1) {
            this._onMenuKeyDown(submenuIndex, event);
            return;
        }

        const buttonIndex = this._topLevelButtons.indexOf(event.target);

        if (buttonIndex !== -1 && this._submenus[buttonIndex]) {
            this._onButtonKeyDown(buttonIndex, event);
            return;
        }

        this._onLinkKeyDown(event);
    }

    _onLinkKeyDown(event) {
        const targetIndex = this._topLevelFocusable.indexOf(document.activeElement);

        if (this._openIndex !== null && targetIndex !== -1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
            this._toggleExpand(this._openIndex, false);
        }

        this._controlFocusByKey(event, this._topLevelFocusable, targetIndex);
    }

    _onMenuKeyDown(index, event) {
        if (this._openIndex === null) return;

        const menuLinks = [...this._submenus[this._openIndex].querySelectorAll(FOCUSABLE_SELECTOR)];
        const currentIndex = menuLinks.indexOf(document.activeElement);

        if (event.key === 'Escape') {
            this._topLevelButtons[this._openIndex].focus();
            this._toggleExpand(this._openIndex, false);
            return;
        }

        this._controlFocusByKey(event, menuLinks, currentIndex);

        // Wrap focus at the last item.
        if (event.key === 'Tab' && document.activeElement === menuLinks[menuLinks.length - 1]) {
            event.preventDefault();
            menuLinks[0]?.focus();
        }
    }

    _onButtonKeyDown(index, event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this._toggleExpand(index, true);
            return;
        }

        if (event.key === 'Escape') {
            this._toggleExpand(index, false);
            return;
        }

        if (this._openIndex === index && event.key === 'ArrowDown') {
            event.preventDefault();
            this._submenus[this._openIndex]?.querySelector('a')?.focus();
        }
    }

    _onBlur(event) {
        if (!this.el.contains(event.relatedTarget) && this._openIndex !== null) {
            this._toggleExpand(this._openIndex, false);
        }
    }

    _controlFocusByKey(event, nodeList, currentIndex) {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > -1) nodeList[Math.max(0, currentIndex - 1)]?.focus();
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex > -1) nodeList[Math.min(nodeList.length - 1, currentIndex + 1)]?.focus();
                break;
            case 'Home':
                event.preventDefault();
                nodeList[0]?.focus();
                break;
            case 'End':
                event.preventDefault();
                nodeList[nodeList.length - 1]?.focus();
                break;
        }
    }

    _toggleExpand(index, expanded) {
        // Close the previously open item before opening a new one.
        if (this._openIndex !== null && this._openIndex !== index) {
            this._toggleExpand(this._openIndex, false);
        }

        const button = this._topLevelButtons[index];
        if (!button) return;

        if (expanded) {
            this._openIndex = index;
            clearTimeout(this._timers[index]);
            this._timers[index] = null;
            button.setAttribute('aria-expanded', 'true');
        } else {
            this._timers[index] = setTimeout(() => {
                button.setAttribute('aria-expanded', 'false');
                if (this._openIndex === index) this._openIndex = null;
                this._timers[index] = null;
            }, COLLAPSE_DELAY);
        }
    }
}
