import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.jsx';
import { save } from './save.jsx';

import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save,
});
