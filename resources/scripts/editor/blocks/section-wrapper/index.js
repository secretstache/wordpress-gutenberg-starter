import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import { getBaseBackgroundAttributes, responsiveSpacingAttribute } from '@secretstache/wordpress-gutenberg';

import { edit } from './edit.js';

import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save: () => (<InnerBlocks.Content />),
    attributes: {
        ...getBaseBackgroundAttributes({
            hasBackgroundMedia: true,
            hasOverlay: true,
        }),
        ...responsiveSpacingAttribute,
        ...blockMetadata.attributes,
    },
});
