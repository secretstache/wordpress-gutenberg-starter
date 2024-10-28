import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.js';

import blockMetadata from './block.json';

export const POST_TYPE = {
    RESOURCES: 'posts',
};

export const LAYOUT_TYPE = {
    BLOCK_GRID: 'block-grid',
    STACKED: 'stacked',
};

export const QUERY_TYPE = {
    LATEST: 'latest',
    BY_CATEGORY: 'by_category',
    CURATED: 'curated',
};

registerBlockType(blockMetadata, {
    edit,
});
