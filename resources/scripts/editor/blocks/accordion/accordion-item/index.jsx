import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit.jsx';
import { save } from './save.jsx';

import blockMetadata from './block.json';

registerBlockType(blockMetadata, {
    edit,
    save,
    __experimentalLabel: (attributes, { context }) => {
        const { title } = attributes;

        const customName = attributes?.metadata?.name;

        if ( context === 'list-view' && ( customName || title ) ) {
            return customName || title;
        }
    },
});
