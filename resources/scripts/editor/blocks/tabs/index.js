import { registerBlockType } from '@wordpress/blocks';
import { createContext } from '@wordpress/element';

import './tabs-item/index.js';

import { edit } from './edit.jsx';
import { save } from './save.jsx';

import blockMetadata from './block.json';

export const LAYOUT_TYPE = {
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
