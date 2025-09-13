import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { createContext } from '@wordpress/element';

import './accordion-item/index.js';

import { edit } from './edit.jsx';
import blockMetadata from './block.json';
import { addInnerBlocksCleanupFilter } from '@secretstache/wordpress-gutenberg';

export const POST_TYPE = {
    FAQ: 'ssm_faq',
};

export const DATA_SOURCE = {
    NONE: 'none',
    FAQ: 'faq',
};

export const QUERY_TYPE = {
    LATEST: 'latest',
    BY_CATEGORY: 'by_faq_category',
    CURATED: 'curated',
};

export const TAXONOMY = {
    FAQ_CATEGORY: 'ssm_faq_category',
};

export const AccordionContext = createContext();

addInnerBlocksCleanupFilter(blockMetadata.name);

registerBlockType(blockMetadata, {
    edit,
    save: () => (<InnerBlocks.Content />),
});
