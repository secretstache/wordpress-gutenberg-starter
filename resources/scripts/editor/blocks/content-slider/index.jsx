import { registerBlockType } from '@wordpress/blocks';
import { createContext } from '@wordpress/element';

import './slide/index.js';

import { edit } from './edit.jsx';
import { save } from './save.jsx';

import blockMetadata from './block.json';

export const SplideContext = createContext();

registerBlockType(blockMetadata, {
    edit,
    save,
});
