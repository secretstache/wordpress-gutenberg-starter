import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import { edit } from './edit';

import './block-grid-item/index';

import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save: () => (<InnerBlocks.Content />),
});
