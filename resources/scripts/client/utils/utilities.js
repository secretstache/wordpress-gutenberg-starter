/**
 * Sets --vw and --vh CSS custom properties on <html>, updated on resize.
 * Uses requestAnimationFrame to coalesce multiple ResizeObserver callbacks
 * within the same frame into a single DOM write.
 */
export const setViewportUnits = () => {
    let frame = null;

    const update = () => {
        if (frame) cancelAnimationFrame(frame);

        frame = requestAnimationFrame(() => {
            frame = null;
            document.documentElement.style.setProperty('--vw', `${document.documentElement.clientWidth / 100}px`);
            document.documentElement.style.setProperty('--vh', `${document.documentElement.clientHeight / 100}px`);
        });
    };

    new ResizeObserver(update).observe(document.body);
};

// Cache fetch Promises by src so duplicate SVG srcs share one network request.
const svgFetchCache = new Map();

const fetchSvgText = (src) => {
    if (!svgFetchCache.has(src)) {
        svgFetchCache.set(src, fetch(src).then((res) => res.text()));
    }

    return svgFetchCache.get(src);
};

/**
 * Inlines an SVG referenced by <img class="editable-svg"> so it can be styled with CSS.
 * Deduplicates network requests — multiple images sharing the same src resolve from one fetch.
 * @param {HTMLImageElement} img
 */
export const EditableSvg = (img) => {
    const src = img.getAttribute('src');
    if (!src) return;

    fetchSvgText(src)
        .then((data) => {
            const svg = new DOMParser().parseFromString(data, 'image/svg+xml').querySelector('svg');
            if (!svg) return;

            const id = img.getAttribute('id');
            const classes = (img.getAttribute('class') ?? '')
                .split(/\s+/)
                .filter((c) => c && c !== 'editable-svg');

            if (id) svg.setAttribute('id', id);
            svg.classList.add(...classes, 'replaced-svg');
            if (!data.includes(' a:')) svg.removeAttribute('xmlns:a');

            if (!svg.getAttribute('viewBox') && svg.getAttribute('width') && svg.getAttribute('height')) {
                svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('width')} ${svg.getAttribute('height')}`);
            }

            img.replaceWith(svg);
        })
        .catch((err) => console.error('[EditableSvg] Failed to load SVG:', src, err));
};

/**
 * Debounces a function — delays execution until `wait` ms after the last call.
 * @param {Function} callback
 * @param {number} wait
 * @returns {Function}
 */
export const debounce = (callback, wait) => {
    let timer = null;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), wait);
    };
};

/**
 * Throttles a function — executes at most once every `delay` ms.
 * Queues the last call so the final invocation is never skipped.
 * @param {Function} callback
 * @param {number} delay
 * @returns {Function}
 */
export const throttle = (callback, delay) => {
    let isThrottled = false;
    let pending = null;

    const invoke = (...args) => {
        isThrottled = true;
        callback(...args);

        setTimeout(() => {
            isThrottled = false;

            if (pending !== null) {
                const queued = pending;
                pending = null;
                invoke(...queued);
            }
        }, delay);
    };

    return (...args) => {
        if (isThrottled) {
            pending = args;
            return;
        }

        invoke(...args);
    };
};

/**
 * Copies text to the clipboard.
 * @param {string} text
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('[copyToClipboard]', err);
    }
};

// Delay before smooth-scrolling after a hash link click (allows layout to settle).
const SCROLL_DELAY_MS = 500;

/**
 * Smooth-scrolls to the element matching window.location.hash on page load,
 * and wires up all in-page anchor clicks to do the same.
 * Accounts for fixed header height.
 */
export const scrollToHash = () => {
    if (window.location.hash === '#main') return;

    const hash = window.location.hash;

    if (hash) {
        // Clear hash immediately so the browser doesn't jump to the anchor.
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    let _header = null;
    const getHeader = () => (_header ??= document.querySelector('.site-header'));

    const scrollTo = (target) => {
        const headerOffset = getHeader()?.offsetHeight ?? 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

        setTimeout(() => window.scrollTo({ top, behavior: 'smooth' }), SCROLL_DELAY_MS);
    };

    window.addEventListener('load', () => {
        if (!hash) return;
        const target = document.getElementById(hash.substring(1));
        if (target) scrollTo(target);
    });

    // One delegated listener handles all current and future in-page anchors.
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]:not([href="#main"])');
        if (!anchor) return;
        if (e.target.closest('.wp-block-ssm-horizontal-tabs, .wp-block-ssm-tabs')) return;

        const id = anchor.getAttribute('href').substring(1);
        const target = document.getElementById(id);

        if (target) {
            e.preventDefault();
            e.stopPropagation();
            scrollTo(target);
        }
    });
};
