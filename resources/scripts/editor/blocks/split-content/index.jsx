import { registerBlockType } from '@wordpress/blocks';
import { getBaseBackgroundAttributes } from '@secretstache/wordpress-gutenberg';

import { edit } from './edit.jsx';
import { save } from './save.jsx';

import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save,
    attributes: {
        ...getBaseBackgroundAttributes({
            hasBackgroundMedia: true,
        }),

        ...blockMetadata.attributes,
    },
});
