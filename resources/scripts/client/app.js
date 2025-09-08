import domReady from '@wordpress/dom-ready';

import { setViewportUnits, PlayVideoInViewportOnly, EditableSvg, scrollToHash } from './utils/utilities.js';
import { Offcanvas } from './global/offcanvas';
import { Header } from './global/header';
import { DropdownMenu } from './global/dropdownMenu';

domReady(async () => {
    setViewportUnits();

    scrollToHash();

    Array.from(document.querySelectorAll('.editable-svg')).map((img) => EditableSvg(img));

    // stop autoplay video when out of viewport
    Array.from(document.querySelectorAll('video[autoplay]')).map((video) => PlayVideoInViewportOnly(video));

    const offcanvas = document.querySelector('.offcanvas');
    if (offcanvas) {
        new Offcanvas(offcanvas);
    }

    const header = document.querySelector('.site-header');
    if (header) {
        new Header(header);
    }

    DropdownMenu();
});
