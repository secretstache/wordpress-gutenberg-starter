import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.js';
import { save } from './save.js';

import './accordion-item/index.js';

import blockMetadata from './block.json';

export const LAYOUT_TYPE = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',
};

registerBlockType(blockMetadata, {
    edit,
    save,
});
