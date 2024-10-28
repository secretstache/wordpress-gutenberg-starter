import domReady from '@wordpress/dom-ready';
import { getBlockVariations, unregisterBlockVariation } from '@wordpress/blocks';
import {
    setRootBlock,
    hideRootBlockForOtherBlocks,
} from '@secretstache/wordpress-gutenberg';

import './blocks/section-wrapper/index.js';
// import './blocks/accordion/index.js';
// import './blocks/block-grid/index.js';
// import './blocks/content-slider/index.js';
// import './blocks/split-content/index.js';
// import './blocks/tabs/index.js';
// import './blocks/call-to-action/index.js';
// import './blocks/logo-wall/index.js';
// import './blocks/blog-feed/index.js';
// import './blocks/team-members/index.js';
// import './blocks/icon/index.js';
// import './blocks/testimonials/index.js';

import {
    reassignBlockCategories,
} from '@scripts/editor/filters/index.js';
import { unsetBlocks, setButtonStyles } from '@scripts/editor/utils/index.js';

reassignBlockCategories();

const rootBlockName = 'ssm/section-wrapper';

domReady(() => {
    hideRootBlockForOtherBlocks(rootBlockName);
    setRootBlock(rootBlockName);

    unsetBlocks();

    // unset unnecessary embed blocks
    getBlockVariations("core/embed")
        .forEach(function (embed) {
            if (embed.name !== "youtube" && embed.name !== "vimeo") {
                unregisterBlockVariation("core/embed", embed.name);
            }
        });

    setButtonStyles();
});
