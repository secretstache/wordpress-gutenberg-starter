import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.js';
import { save } from './save.js';

import blockMetadata from './block.json';

import './block-grid-item/index.js';

export const getGridClass = (columns) => {
    switch (columns) {
        case 1:
            return 'grid-cols-1';
        case 2:
            return 'grid-cols-1 sm:grid-cols-2';
        case 3:
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        case 4:
            return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
        default:
            return 'grid-cols-1 sm:grid-cols-2';
    }
};

registerBlockType(blockMetadata, {
    edit,
    save,
});
