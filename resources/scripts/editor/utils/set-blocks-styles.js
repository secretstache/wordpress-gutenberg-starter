import { registerBlockStyle, unregisterBlockStyle } from '@wordpress/blocks';

export const setBlocksStyles = () => {
    unregisterBlockStyle('core/button', 'fill');
    // unregisterBlockStyle('core/button', 'outline');

    registerBlockStyle('core/button', [
        {
            name: 'white',
            label: 'White',
        },
    ]);
};
