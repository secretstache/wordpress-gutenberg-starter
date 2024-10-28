import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.js';
import { save } from './save.js';

import './accordion-item/index.js';

import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save,
});
