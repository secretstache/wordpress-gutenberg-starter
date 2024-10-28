import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.js';

import blockMetadata from './block.json';

export const POST_TYPE = {
    TEAM: 'ssm_team',
};

export const QUERY_TYPE = {
    ALL: 'all',
    CURATED: 'curated',
};

registerBlockType(blockMetadata, {
    edit,
});
