import { registerBlockType } from '@wordpress/blocks';
import { linkControlAttribute } from '@secretstache/wordpress-gutenberg';

import { edit } from './edit.js';
import { save } from './save.js';

import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save,
    attributes: {
        ...linkControlAttribute,
        ...blockMetadata.attributes,
    },
});

