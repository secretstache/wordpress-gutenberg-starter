import domReady from '@wordpress/dom-ready';

import {
    rootBlockVisibilityFilter,
    setRootBlockForPostTypes,
} from '@secretstache/wordpress-gutenberg';

import './plugins/header-preview.jsx';

import './blocks/section-wrapper/index.jsx';
import './blocks/image/index.jsx';

import { addBlockCategoriesFilter, allowedBlocksForColumnFilter, backgroundColorClassFilter } from '@scripts/editor/filters/index.js';
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
            backgroundColorClassFilter,
        ],
    );
});
