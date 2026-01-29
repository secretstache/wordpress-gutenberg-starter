import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { createContext } from '@wordpress/element';
import { InnerBlocksCleanupFilter } from '@secretstache/wordpress-gutenberg';

import './accordion-item/index.jsx';

import { edit } from './edit.jsx';
import blockMetadata from './block.json';

export const AccordionContext = createContext();

registerBlockType(blockMetadata, {
    edit,
    save: () => (<InnerBlocks.Content />),
});

const innerBlocksCleanupFilter = new InnerBlocksCleanupFilter(blockMetadata.name);
innerBlocksCleanupFilter.add();
