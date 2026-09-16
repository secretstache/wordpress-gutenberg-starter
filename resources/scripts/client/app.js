import domReady from '@wordpress/dom-ready';
import { setViewportUnits, scrollToHash, EditableSvg } from './utils/utilities.js';

export async function initComponents() {
    setViewportUnits();
    scrollToHash();
    document.querySelectorAll('.editable-svg').forEach((img) => EditableSvg(img));

    // globals
    const header = document.querySelector('.site-header');
    const offcanvas = document.querySelector('.offcanvas');
    const dropdowns = [...document.querySelectorAll('.is-dropdown')];
    const modals = [...document.querySelectorAll('.modal')];

    // blocks
    const videos = [...document.querySelectorAll('.wp-block-video, .wp-block-embed')];

    const results = await Promise.all(
        [
            header && import('./global/header.js').then(({ Header }) => Header.getOrCreate(header)),
            offcanvas && import('./global/offcanvas.js').then(({ Offcanvas }) => Offcanvas.getOrCreate(offcanvas)),
            dropdowns.length && import('./global/dropdownMenu.js').then(({ DropdownMenu }) => dropdowns.map((el) => DropdownMenu.getOrCreate(el, { topLevelClickable: true }))),
            modals.length && import('./global/modal.js').then(({ Modal }) => modals.map((el) => Modal.getOrCreate(el))),
            videos.length && import('./blocks/video.js').then(({ VideoPlayer }) => videos.map((el) => VideoPlayer.getOrCreate(el))),
        ].filter(Boolean),
    );

    return results.flat();
}

domReady(initComponents);

import.meta.glob([
    '../../images/**',
    '!../../images/cms/**',
    '../../fonts/**',
]);
