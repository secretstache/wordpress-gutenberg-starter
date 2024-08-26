import domReady from '@roots/sage/client/dom-ready';
import { setViewportUnits, PlayVideoInViewportOnly, EditableSvg, scrollToHash } from './utils/utilities';
import { Offcanvas } from './global/offcanvas';
import { Header } from './global/header';
// import { Modal } from './global/modal';
import { DropdownMenu } from './global/dropdownMenu';

domReady(async () => {
    // fix vw and vh units
    setViewportUnits();

    // hash links
    scrollToHash();

    // editable svg
    Array.from(document.querySelectorAll('.editable-svg')).map((img) => EditableSvg(img));

    // stop autoplay video when out of viewport
    Array.from(document.querySelectorAll('video[autoplay]')).map((video) => PlayVideoInViewportOnly(video));

    // off canvas
    const offcanvas = document.querySelector('.offcanvas');
    if (offcanvas) {
        new Offcanvas(offcanvas);
    }

    // site header
    const header = document.querySelector('.site-header');
    if (header) {
        new Header(header);
    }

    // modals
    // Array.from(document.querySelectorAll('.modal')).map((el) => new Modal(el));

    // menus
    DropdownMenu();
});
