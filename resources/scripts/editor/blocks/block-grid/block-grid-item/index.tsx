import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit';
import { save } from './save';

import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save,
});
