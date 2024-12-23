import { addFilter, removeFilter } from '@wordpress/hooks';
import { getBlockTypes } from '@wordpress/blocks';

export const allowedBlocksForColumnFilter = {
    add() {
        addFilter(
            'blocks.registerBlockType',
            'ssm/allowed-blocks-for-column',
            (blockSettings, blockName) => {
                if (blockName !== 'core/column') {
                    return blockSettings;
                }

                // get all blockTypes
                blockSettings.allowedBlocks = getBlockTypes()
                    ?.filter((allowedBlock) => {
                        const hasParent = !!allowedBlock?.parent;
                        const isComponentsCategory = allowedBlock?.category === 'ssm-components';
                        const isColumn = allowedBlock.name === 'core/columns';

                        return (isComponentsCategory && !hasParent) || isColumn;
                    })
                    ?.map(allowedBlock => allowedBlock.name);

                return blockSettings;
            },
        );
    },
    remove() {
        removeFilter('blocks.registerBlockType', 'ssm/allowed-blocks-for-column');
    },
};
