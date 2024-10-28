import { addFilter } from '@wordpress/hooks';
import { getBlockTypes } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';

export const setAllowedBlocksForColumn = () => {
    addFilter(
        'blocks.registerBlockType',
        'ssm/core-column-allowed-blocks',
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

    dispatch('core/blocks').reapplyBlockTypeFilters();
};
