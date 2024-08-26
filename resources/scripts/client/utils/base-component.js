import { Data } from './dom/data.js';
import { EventHandler } from './dom/event-handler.js';
import { executeAfterTransition, getElement } from './utilities.js';

export class BaseComponent {
    constructor(element, config) {
        element = getElement(element);

        if (!element) {
            return;
        }

        this._element = element;
        this._config = this._getConfig(config);

        Data.set(this._element, this.constructor.DATA_KEY, this);
    }

    // Public
    dispose() {
        Data.remove(this._element, this.constructor.DATA_KEY);
        EventHandler.off(this._element, this.constructor.EVENT_KEY);

        for (const propertyName of Object.getOwnPropertyNames(this)) {
            this[propertyName] = null;
        }
    }

    _queueCallback(callback, element, isAnimated = true) {
        executeAfterTransition(callback, element, isAnimated);
    }

    _getConfig(config) {
        config = {
            ...this.constructor.Default,
            ...(typeof config === 'object' ? config : {}),
        };

        return config;
    }

    // Static
    static getInstance(element) {
        return Data.get(getElement(element), this.DATA_KEY);
    }

    static getOrCreateInstance(element, config = {}) {
        return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
    }

    static get DATA_KEY() {
        return `ssm.${this.NAME}`;
    }

    static get EVENT_KEY() {
        return `.${this.DATA_KEY}`;
    }

    static get Default() {
        return {};
    }

    static get NAME() {
        throw new Error('You have to implement the static method "NAME", for each component!');
    }

    static eventName(name) {
        return `${name}${this.EVENT_KEY}`;
    }
}
