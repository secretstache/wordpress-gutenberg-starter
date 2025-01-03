import { registerBlockType } from '@wordpress/blocks';

import './slide/index.js';

import { edit } from './edit.js';
import { save } from './save.js';

import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save,
});
