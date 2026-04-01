/**
 * LazyLoad — IntersectionObserver-based lazy loader for images, videos, and background images.
 *
 * Usage:
 *   const loader = LazyLoad('.lazy-load');
 *   loader.observe();
 *
 * Supports data attributes: data-src, data-srcset, data-poster,
 * data-background-image, data-background-image-set, data-toggle-class.
 */

const VALID_ATTRIBUTES = ['data-src', 'data-srcset', 'data-background-image', 'data-background-image-set', 'data-toggle-class'];

const sanitizeUrl = (url) => {
    const trimmed = url.trim();

    return /^javascript:/i.test(trimmed) ? '' : trimmed;
};

const defaultConfig = {
    rootMargin: '0px',
    threshold: 0,
    enableAutoReload: false,

    load(element) {
        const tag = element.nodeName.toLowerCase();

        // <picture> — create/find inner <img> and apply alt
        if (tag === 'picture') {
            let img = element.querySelector('img');

            if (!img) {
                img = document.createElement('img');
                element.append(img);
            }

            if (element.dataset.alt) img.alt = element.dataset.alt;
        }

        // <video> without data-src — load <source> children
        if (tag === 'video' && !element.dataset.src) {
            [...element.children].forEach((source) => {
                if (source.dataset.src) source.src = source.dataset.src;
            });
            element.load();
        }

        if (element.dataset.poster) element.poster = element.dataset.poster;
        if (element.dataset.src) element.src = element.dataset.src;
        if (element.dataset.srcset) element.srcset = element.dataset.srcset;

        // Background image (comma-delimited list)
        if (element.dataset.backgroundImage) {
            const delimiter = element.dataset.backgroundDelimiter || ',';
            const urls = element.dataset.backgroundImage
                .split(delimiter)
                .map((u) => sanitizeUrl(u))
                .filter(Boolean)
                .map((u) => `url('${u}')`);
            if (urls.length) element.style.backgroundImage = urls.join(', ');
        } else if (element.dataset.backgroundImageSet) {
            const delimiter = element.dataset.backgroundDelimiter || ',';
            const links = element.dataset.backgroundImageSet.split(delimiter).map((u) => sanitizeUrl(u)).filter(Boolean);
            let first = links[0].substring(0, links[0].indexOf(' ')) || links[0];
            if (!first.startsWith('url(')) first = `url(${first})`;

            if (links.length === 1) {
                element.style.backgroundImage = first;
            } else {
                element.style.setProperty('background-image', `image-set(${links})`);
            }
        }

        if (element.dataset.toggleClass) {
            element.classList.toggle(element.dataset.toggleClass);
        }
    },

    loaded() {},
};

const _loaded = new WeakSet();
const markLoaded = (el) => _loaded.add(el);
const isLoaded = (el) => _loaded.has(el);

const applyPlaceholder = (el) => {
    if (el.dataset.placeholderBackground) {
        el.style.background = el.dataset.placeholderBackground;
    }
};

const getElements = (selector, root = document) => {
    if (selector instanceof Element) return [selector];
    if (selector instanceof NodeList) return [...selector];

    return [...root.querySelectorAll(selector)];
};

const onIntersection = (load, loaded) => (entries, observer) => {
    entries.forEach((entry) => {
        if (!(entry.intersectionRatio > 0 || entry.isIntersecting)) return;

        observer.unobserve(entry.target);

        if (!isLoaded(entry.target)) {
            load(entry.target);
            markLoaded(entry.target);
            loaded(entry.target);
        }
    });
};

const onMutation = (load) => (entries) => {
    entries.forEach((entry) => {
        if (isLoaded(entry.target) && entry.type === 'attributes' && VALID_ATTRIBUTES.includes(entry.attributeName)) {
            load(entry.target);
        }
    });
};

export const LazyLoad = (selector = '.lazy-load', options = {}) => {
    const config = { ...defaultConfig, ...options };
    const { root, rootMargin, threshold, enableAutoReload, load, loaded } = config;

    const observer = new IntersectionObserver(onIntersection(load, loaded), { root, rootMargin, threshold });
    const mutationObserver = enableAutoReload ? new MutationObserver(onMutation(load)) : null;

    getElements(selector, root).forEach(applyPlaceholder);

    return {
        observe() {
            getElements(selector, root).forEach((el) => {
                if (isLoaded(el)) return;

                if (mutationObserver) {
                    mutationObserver.observe(el, { subtree: true, attributes: true, attributeFilter: VALID_ATTRIBUTES });
                }

                observer.observe(el);
            });
        },

        triggerLoad(element) {
            if (isLoaded(element)) return;
            load(element);
            markLoaded(element);
            loaded(element);
        },

        observer,
        mutationObserver,
    };
};
