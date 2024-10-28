import { registerBlockType } from '@wordpress/blocks';
import { createContext } from '@wordpress/element';

import './tabs-item/index.js';

import { edit } from './edit.js';
import { save } from './save.js';

import blockMetadata from './block.json';

export const LAYOUT_TYPES = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',
};

export const TabsContext = createContext({
    activeItemId: null,
    setActiveItemId: () => {},
});

registerBlockType(blockMetadata, {
    edit,
    save,
});
