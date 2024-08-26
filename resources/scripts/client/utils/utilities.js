const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend';

/**
 * Properly escape IDs selectors to handle weird IDs
 * @param {string} selector
 * @returns {string}
 */
const parseSelector = (selector) => {
    if (selector && window.CSS && window.CSS.escape) {
        // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
        selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
    }

    return selector;
};

const getTransitionDurationFromElement = (element) => {
    if (!element) {
        return 0;
    }

    // Get transition-duration of the element
    let { transitionDuration, transitionDelay } = window.getComputedStyle(element);

    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);

    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
    }

    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];

    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};

const triggerTransitionEnd = (element) => {
    element.dispatchEvent(new Event(TRANSITION_END));
};

const isElement = (object) => {
    if (!object || typeof object !== 'object') {
        return false;
    }

    if (typeof object.jquery !== 'undefined') {
        object = object[0];
    }

    return typeof object.nodeType !== 'undefined';
};

const getElement = (object) => {
    // it's a jQuery object or a node element
    if (isElement(object)) {
        return object.jquery ? object[0] : object;
    }

    if (typeof object === 'string' && object.length > 0) {
        return document.querySelector(parseSelector(object));
    }

    return null;
};

const isVisible = (element) => {
    if (!isElement(element) || element.getClientRects().length === 0) {
        return false;
    }

    const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
    // Handle `details` element as its content may falsie appear visible when it is closed
    const closedDetails = element.closest('details:not([open])');

    if (!closedDetails) {
        return elementIsVisible;
    }

    if (closedDetails !== element) {
        const summary = element.closest('summary');
        if (summary && summary.parentNode !== closedDetails) {
            return false;
        }

        if (summary === null) {
            return false;
        }
    }

    return elementIsVisible;
};

const isDisabled = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
    }

    if (element.classList.contains('disabled')) {
        return true;
    }

    if (typeof element.disabled !== 'undefined') {
        return element.disabled;
    }

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};

const findShadowRoot = (element) => {
    if (!document.documentElement.attachShadow) {
        return null;
    }

    // Can find the shadow root otherwise it'll return the document
    if (typeof element.getRootNode === 'function') {
        const root = element.getRootNode();

        return root instanceof ShadowRoot ? root : null;
    }

    if (element instanceof ShadowRoot) {
        return element;
    }

    // when we don't find a shadow root
    if (!element.parentNode) {
        return null;
    }

    return findShadowRoot(element.parentNode);
};

/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = (element) => {
    element.offsetHeight;
};

const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
    return typeof possibleCallback === 'function' ? possibleCallback(...args) : defaultValue;
};

const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
    if (!waitForTransition) {
        execute(callback);

        return;
    }

    const durationPadding = 5;
    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;

    let called = false;

    const handler = ({ target }) => {
        if (target !== transitionElement) {
            return;
        }

        called = true;
        transitionElement.removeEventListener(TRANSITION_END, handler);
        execute(callback);
    };

    transitionElement.addEventListener(TRANSITION_END, handler);
    setTimeout(() => {
        if (!called) {
            triggerTransitionEnd(transitionElement);
        }
    }, emulatedDuration);
};

const setViewportUnits = () => {
    const fn = () => {
        const vw = document.documentElement.clientWidth / 100;
        const vh = document.documentElement.clientHeight / 100;
        document.documentElement.style.setProperty('--vw', `${vw}px`);
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const resizeObserver = new ResizeObserver(() => fn());
    resizeObserver.observe(document.body, {
        childlist: true,
        subtree: true,
    });
};

const support = (type) => window && window[type];

const onVideoIntersection = () => (entries) => {
    entries.forEach((entry) => {
        const video = entry.target;

        if (video.classList.contains('lazy-load')) {
            if (!video.dataset.loaded) return;
        }

        if (entry.intersectionRatio > 0 || entry.isIntersecting) {
            video.play();
        } else {
            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    video.pause();
                });
            }
        }
    });
};

const PlayVideoInViewportOnly = (video) => {
    if (support('IntersectionObserver')) {
        const observer = new IntersectionObserver(onVideoIntersection(), {
            root: null,
            rootMargin: '0px',
            threshold: 0,
        });

        observer.observe(video);
    }
};

const EditableSvg = (img) => {
    const imgID = img.getAttribute('id');
    const imgClass = img.getAttribute('class');
    const imgURL = img.getAttribute('src');

    fetch(imgURL)
        .then((response) => response.text())
        .then((data) => {
            // let svg = data.querySelector('svg');
            const parser = new DOMParser();
            const html = parser.parseFromString(data, 'image/svg+xml');
            let svg = html.querySelector('svg');

            if (typeof imgID !== 'undefined') {
                svg.setAttribute('id', imgID);
            }

            if (typeof imgClass !== 'undefined') {
                svg.classList.add(imgClass, 'replaced-svg');
                svg.classList.remove(imgClass, 'editable-svg');
            }

            svg.removeAttribute('xmlns:a');

            if (!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
                svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('width') + ' ' + svg.getAttribute('height'));
            }

            img.replaceWith(svg);
        });
};

const debounce = (callback, wait) => {
    let timeoutId = null;

    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
};

const throttle = (callback, delay) => {
    let isThrottled = false,
        args,
        context;

    function wrapper() {
        if (isThrottled) {
            args = arguments;
            context = this;

            return;
        }

        isThrottled = true;
        callback.apply(this, arguments);

        setTimeout(() => {
            isThrottled = false;
            if (args) {
                wrapper.apply(context, args);
                args = context = null;
            }
        }, delay);
    }

    return wrapper;
};

const inViewport = (el, callback, options) => {
    const observer = new IntersectionObserver(callback, { ...options });
    observer.observe(el);
};

async function copyToClipboard(textToCopy) {
    try {
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(textToCopy);
        }
    } catch (err) {
        console.error(err);
    }
}

const scrollToHash = () => {
    // hash links
    let hash = window.location.hash;

    if (hash) {
        window.location.hash = '';
    }

    const scrollFn = (target) => {
        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        setTimeout(function () {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }, 500);
    };

    window.addEventListener('load', () => {
        const target = document.getElementById(hash.substring(1));

        if (target) scrollFn(target);
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const target = document.getElementById(this.getAttribute('href').substring(1));

            if (target) {
                e.preventDefault();
                e.stopPropagation();
                scrollFn(target);
            }
        });
    });
};

// eslint-disable-next-line max-len
export { execute, executeAfterTransition, findShadowRoot, getElement, getTransitionDurationFromElement, isDisabled, isElement, isVisible, parseSelector, reflow, triggerTransitionEnd, setViewportUnits, PlayVideoInViewportOnly, EditableSvg, debounce, throttle, copyToClipboard, inViewport, scrollToHash };
