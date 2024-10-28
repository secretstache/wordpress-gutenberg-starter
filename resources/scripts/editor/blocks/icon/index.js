import { registerBlockType } from '@wordpress/blocks';
import { getMediaAttribute } from '@secretstache/wordpress-gutenberg';

import { edit } from './edit.js';
import { save } from './save.js';

import blockMetadata from './block.json';

export const ICON_SIZE = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
};

export const getSizeClass = (size) => {
    switch(size) {
        case ICON_SIZE.SMALL: return 'w-32 h-32';
        case ICON_SIZE.LARGE: return 'w-96 h-96';
        default: return 'w-64 h-64';
    }
};

export const getSizeValue = (size) => {
    const sizeMap = {
        [ICON_SIZE.SMALL]: '128',
        [ICON_SIZE.MEDIUM]: '256',
        [ICON_SIZE.LARGE]: '384',
    };
    
    return sizeMap[size] || '256';
};

export const resizeSvg = (svgString, size) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (svg) {
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
    }

    return new XMLSerializer().serializeToString(doc);
};

registerBlockType(blockMetadata, {
    edit,
    save,
    attributes: {
        ...getMediaAttribute(),
        ...blockMetadata.attributes,
    },
});
