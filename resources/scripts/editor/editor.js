import {
    subscribeForPostTypeChange,
    setPostTypePlugins,
    setPostTypeFilters,
    RootBlockAppenderPlugin,
    RootPatternAppenderPlugin,
    RootBlockFilter,
    HideRootBlockForOtherFilter,
    BlockCategoriesFilter,
    updateAllBlocksApiVersion,
} from '@secretstache/wordpress-gutenberg';

import { BackgroundToneClassFilter } from '@scripts/editor/filters/index.js';
import { HeaderStubPlugin } from '@scripts/editor/plugins/index.js';
import { unsetBlocks, setBlocksVariations, setBlocksStyles, DARK_COLORS, BLOCK_CATEGORIES } from '@scripts/editor/utils/index.js';

import './blocks/section-wrapper/index.jsx';
import './blocks/image/index.jsx';

document.addEventListener('DOMContentLoaded', function () {
    const rootBlockAppenderPlugin = new RootBlockAppenderPlugin();
    const rootPatternAppenderPlugin = new RootPatternAppenderPlugin();
    const headerStubPlugin = new HeaderStubPlugin();

    const rootBlockFilter = new RootBlockFilter();
    const hideRootBlockForOtherFilter = new HideRootBlockForOtherFilter();
    const blockCategoriesFilter = new BlockCategoriesFilter(BLOCK_CATEGORIES);
    const backgroundToneClassFilter = new BackgroundToneClassFilter(DARK_COLORS);

    subscribeForPostTypeChange((currentPostType) => {
        setPostTypePlugins([ rootBlockAppenderPlugin, rootPatternAppenderPlugin, headerStubPlugin ], currentPostType);

        setPostTypeFilters(
            [
                rootBlockFilter,
                hideRootBlockForOtherFilter,
                blockCategoriesFilter,
                backgroundToneClassFilter,
            ],
            currentPostType,
            () => {
                unsetBlocks();
                setBlocksStyles();
                setBlocksVariations();
                updateAllBlocksApiVersion(3);
            }
        );
    });
});
