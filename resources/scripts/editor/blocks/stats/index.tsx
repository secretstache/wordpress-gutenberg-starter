import { registerBlockType } from '@wordpress/blocks';

import { edit } from './edit';

import blockMetadata from './block.json';
import { AttributesWithMeta } from './types';

registerBlockType(blockMetadata, {
    edit,
    __experimentalLabel: (attributes: AttributesWithMeta, { context }: { context: string }) => {
        const { value } = attributes;

        const customName = attributes.metadata?.name;

        if ( context === 'list-view' && ( customName || value ) ) {
            return customName || value;
        }
    },
});
