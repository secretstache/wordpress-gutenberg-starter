import domReady from '@wordpress/dom-ready';
import {
    rootBlockVisibilityFilter,
    setRootBlockForPostTypes,
} from '@secretstache/wordpress-gutenberg';

import './plugins/header-preview.js';

import './blocks/section-wrapper/index.js';
// import './blocks/accordion/index.js';
// import './blocks/block-grid/index.js';
// import './blocks/content-slider/index.js';
// import './blocks/split-content/index.js';
// import './blocks/tabs/index.js';
// import './blocks/call-to-action/index.js';
// import './blocks/logo-wall/index.js';
// import './blocks/blog-feed/index.js';
import './blocks/team-members/index.js';
// import './blocks/icon/index.js';
// import './blocks/testimonials/index.js';

import { addBlockCategoriesFilter, allowedBlocksForColumnFilter } from '@scripts/editor/filters/index.js';
import { unsetBlocks, setBlocksVariations, setBlocksStyles } from '@scripts/editor/utils/index.js';

const rootBlockName = 'ssm/section-wrapper';

addBlockCategoriesFilter();

domReady(() => {
    unsetBlocks();
    setBlocksStyles();
    setBlocksVariations();

    setRootBlockForPostTypes(
        rootBlockName,
        ['page', 'post', 'ssm_design_system'],
        () => {
            unsetBlocks();
            setBlocksStyles();
            setBlocksVariations();
        },
        [
            rootBlockVisibilityFilter,
            allowedBlocksForColumnFilter,
        ],
    );
});
