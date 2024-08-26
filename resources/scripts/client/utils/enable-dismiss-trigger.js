import { EventHandler } from './dom/event-handler.js';
import { isDisabled } from './utilities.js';

export const enableDismissTrigger = (component, method = 'hide') => {
    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
    const name = component.NAME;

    EventHandler.on(document, clickEvent, `[data-dismiss="${name}"]`, function (event) {
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

        const target = this.closest(`.${name}`);

        const instance = component.getOrCreateInstance(target);

        // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
        instance[method]();
    });
};
