import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.jsx';
import { save } from './save.jsx';

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
