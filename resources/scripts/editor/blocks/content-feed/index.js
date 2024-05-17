import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.js';

import block from './block.json';

export const DATA_SOURCES = {
    NEWS: 'news',
    RESOURCES: 'resources',
};

export const POST_TYPES = {
    NEWS: 'ssm_news',
    RESOURCES: 'posts',
    RESOURCES_CATEGORIES: 'category',
    NEWS_CATEGORIES: 'ssm_news_category',
};

export const QUERY_TYPES = {
    LATEST: 'latest',
    CURATED: 'curated',
    LATEST_BY_CATEGORY: 'latest_by_category',
};

registerBlockType(block.name, {
    ...block,
    edit,
});
