function normalizeData(value) {
    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }

    if (value === Number(value).toString()) {
        return Number(value);
    }

    if (value === '' || value === 'null') {
        return null;
    }

    if (typeof value !== 'string') {
        return value;
    }

    try {
        return JSON.parse(decodeURIComponent(value));
    } catch {
        return value;
    }
}

function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
}

export const Manipulator = {
    setDataAttribute(element, key, value) {
        element.setAttribute(`data-ssm-${normalizeDataKey(key)}`, value);
    },

    removeDataAttribute(element, key) {
        element.removeAttribute(`data-ssm-${normalizeDataKey(key)}`);
    },

    getDataAttributes(element) {
        if (!element) {
            return {};
        }

        const attributes = {};
        const ssmKeys = Object.keys(element.dataset).filter((key) => key.startsWith('ssm') && !key.startsWith('ssmConfig'));

        for (const key of ssmKeys) {
            let pureKey = key.replace(/^ssm/, '');
            pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
            attributes[pureKey] = normalizeData(element.dataset[key]);
        }

        return attributes;
    },

    getDataAttribute(element, key) {
        return normalizeData(element.getAttribute(`data-ssm-${normalizeDataKey(key)}`));
    },
};
