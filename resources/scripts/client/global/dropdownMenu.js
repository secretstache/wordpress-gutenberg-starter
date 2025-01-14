export const DropdownMenu = () => {
    const menus = document.querySelectorAll('.is-dropdown');

    menus.forEach((menu) => {
        new Dropdown(menu, {
            topLevelClickable: true,
        });
    });
};

class Dropdown {
    constructor(domNode, options) {
        this.rootNode = domNode;
        this.openIndex = null;
        this.useArrowKeys = options?.useArrowKeys || true;
        this.withArrowButton = options?.withArrowButton || false;
        this.topLevelNodes = [...this.rootNode.children];
        this.topLevelButtons = [];
        this.submenus = [];
        this.timers = new Array(this.topLevelNodes.length).fill(null);
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        this.topLevelNodes.forEach((node, index) => {
            this.initNode(node, index);
        });

        this.rootNode.addEventListener('focusout', this.onBlur.bind(this));
        this.rootNode.addEventListener('keydown', this.onLinkKeyDown.bind(this));
    }

    initNode(node, index) {
        const submenu = node.querySelector('ul');

        // create arrow button
        if (this.withArrowButton && submenu) {
            const link = node.querySelector('a');
            const id = uid();

            const button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', `id_${id}`);
            button.setAttribute('aria-label', `More ${link.textContent} pages`);
            button.classList.add('dropdown-arrow');

            link.insertAdjacentElement('afterend', button);
        }

        const button = node.querySelector('button') ? node.querySelector('button') : node.querySelector('a');

        this.submenus.push(submenu ? submenu : null);
        this.topLevelButtons.push(button);

        // if menu item has submenu
        if (button && submenu) {
            // collapse submenus
            button.setAttribute('aria-expanded', 'false');

            // events
            node.addEventListener('mouseover', () => {
                this.toggleExpand(index, true);
            });
            node.addEventListener('mouseout', () => {
                this.toggleExpand(index, false);
            });
            button.addEventListener('click', (e) => {
                e.preventDefault();
            });
            button.addEventListener('keydown', this.onButtonKeyDown.bind(this, index));
            submenu.addEventListener('keydown', this.onMenuKeyDown.bind(this, index));
        }
    }

    onLinkKeyDown(event) {
        const focusableElements = this.topLevelNodes
            .map((node) => {
                return Array.from(node.children).filter((child) => child.tagName === 'A' || child.tagName === 'BUTTON');
            })
            .flat();

        const targetLinkIndex = focusableElements.indexOf(document.activeElement);

        if (this.openIndex !== null && targetLinkIndex !== -1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
            this.toggleExpand(this.openIndex, false);
        }

        this.controlFocusByKey(event, focusableElements, targetLinkIndex);
    }

    onMenuKeyDown(index, event) {
        if (this.openIndex === null) {
            return;
        }

        const menuLinks = Array.from(this.submenus[this.openIndex].querySelectorAll(this.focusableElements));
        const currentIndex = menuLinks.indexOf(document.activeElement);
        const firstFocusableElement = menuLinks[0];
        const lastFocusableElement = menuLinks[menuLinks.length - 1];

        // close on escape
        if (event.key === 'Escape') {
            this.topLevelButtons[this.openIndex].focus();
            this.toggleExpand(this.openIndex, false);
        }

        // handle arrow key navigation within menu links
        this.controlFocusByKey(event, menuLinks, currentIndex);

        // stay within the submenu on tab press
        let isTabPressed = event.key === 'Tab';

        if (!isTabPressed) return;

        if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            event.preventDefault();
        }
    }

    onButtonKeyDown(index, event) {
        const targetButtonIndex = this.topLevelButtons.indexOf(document.activeElement);

        if (event.key === 'Enter') {
            event.preventDefault();
            this.toggleExpand(index, true);
        }

        // close on escape
        if (event.key === 'Escape') {
            this.toggleExpand(index, false);
        }

        // move focus into the open menu if the current menu is open
        else if (this.openIndex === targetButtonIndex && event.key === 'ArrowDown') {
            event.preventDefault();
            this.submenus[this.openIndex].querySelector('a').focus();
        }
    }

    onBlur(event) {
        const menuContainsFocus = this.rootNode.contains(event.relatedTarget);
        if (!menuContainsFocus && this.openIndex !== null) {
            this.toggleExpand(this.openIndex, false);
        }
    }

    controlFocusByKey(keyboardEvent, nodeList, currentIndex) {
        switch (keyboardEvent.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                keyboardEvent.preventDefault();
                if (currentIndex > -1) {
                    const prevIndex = Math.max(0, currentIndex - 1);
                    nodeList[prevIndex].focus();
                }
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                keyboardEvent.preventDefault();
                if (currentIndex > -1) {
                    const nextIndex = Math.min(nodeList.length - 1, currentIndex + 1);
                    nodeList[nextIndex].focus();
                }
                break;
            case 'Home':
                keyboardEvent.preventDefault();
                nodeList[0].focus();
                break;
            case 'End':
                keyboardEvent.preventDefault();
                nodeList[nodeList.length - 1].focus();
                break;
        }
    }

    toggleExpand(index, expanded) {
        // close open menu, if applicable
        if (this.openIndex !== index) {
            this.toggleExpand(this.openIndex, false);
        }

        // handle menu at called index
        if (this.topLevelButtons[index]) {
            this.openIndex = expanded ? index : null;

            if (expanded) {
                this.topLevelButtons[index].setAttribute('aria-expanded', true);

                if (this.timers[index]) {
                    clearTimeout(this.timers[index]);
                }
            } else {
                this.timers[index] = setTimeout(() => {
                    this.topLevelButtons[index].setAttribute('aria-expanded', false);
                }, 500);
            }
        }
    }
}

const uid = () => {
    return `${Date.now() + Math.floor(Math.random() * 100)}`;
};
