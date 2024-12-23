import { addFilter } from '@wordpress/hooks';

export const addBlockCategoriesFilter = () => {
    addFilter('blocks.registerBlockType', 'ssm/block-categories', (settings, name) => {
        const movedBlocks = [
            'core/cover',
            'core/heading',
            'core/paragraph',
            'core/list',
            'core/image',
            'core/list',
            'core/list-item',
            'core/embed',
            'core/buttons',
            'core/button',
            'core/table',
            'core/pullquote',
            'core/separator',
            'core/shortcode',
            'core/html',
            "core/video",
            'core/columns',
            'core/column',
            'core/details',
            'gravityforms/form',
            'core/group',
            'core/gallery',
        ];

        if (!movedBlocks.includes(name)) {
            return settings;
        }

        let newCategoryName = '';

        if (name !== 'core/columns' && name !== 'core/column') {
            newCategoryName = 'ssm-components';
        } else {
            newCategoryName = 'ssm-templates';
        }

        return {
            ...settings,
            'category': newCategoryName,
        };
    });
};
