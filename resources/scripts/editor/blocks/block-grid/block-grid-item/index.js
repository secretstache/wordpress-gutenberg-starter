import { registerBlockType } from '@wordpress/blocks';
import { linkControlAttribute } from '@secretstache/wordpress-gutenberg';

import { edit } from './edit.jsx';
import { save } from './save.jsx';

import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save,
    attributes: {
        ...linkControlAttribute,
        ...blockMetadata.attributes,
    },
});

