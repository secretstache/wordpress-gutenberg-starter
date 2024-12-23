import { getBlockVariations, unregisterBlockVariation } from '@wordpress/blocks';

export const setBlocksVariations = () => {
    getBlockVariations('core/embed')
        ?.forEach((embed) => {
            if (embed.name !== 'youtube' && embed.name !== 'vimeo') {
                unregisterBlockVariation('core/embed', embed.name);
            }
        });
};
