import { addFilter, removeFilter } from '@wordpress/hooks';
import { select, subscribe } from '@wordpress/data';

export const paragraphAncestorFilter = {
    add() {
        const applyFilter = () => {
            const postType = select('core/editor')?.getCurrentPostType?.();
            if (!postType) return false;
            if (postType === 'wp_block') return true; // skip for patterns

            addFilter(
                'blocks.registerBlockType',
                'ssm/paragraph-ancestor',
                (settings, name) => {
                    if (name !== 'core/paragraph') return settings;

                    return {
                        ...settings,
                        ancestor: ['ssm/section-wrapper'],
                    };
                }
            );

            return true;
        };

        if (!applyFilter()) {
            const unsubscribe = subscribe(() => {
                if (applyFilter()) unsubscribe();
            });
        }
    },

    remove() {
        removeFilter('blocks.registerBlockType', 'ssm/paragraph-ancestor');
    },
};
