import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.js';

import blockMetadata from './block.json';

export const QUERY_TYPE = {
    LATEST: 'latest',
    CURATED: 'curated',
};

export const POST_TYPE = {
    TESTIMONIAL: 'ssm_testimonial',
};

export const LAYOUT_TYPE = {
    GRID: 'grid',
    CAROUSEL: 'carousel',
};

registerBlockType(blockMetadata, {
    edit,
});
