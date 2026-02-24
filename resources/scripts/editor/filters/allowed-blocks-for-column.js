import { addFilter, removeFilter } from '@wordpress/hooks';
import { getBlockTypes } from '@wordpress/blocks';

export class AllowedBlocksForColumnFilter {
    name = 'ssm/allowed-blocks-for-column';
    isAdded = false;

    constructor(
        rootBlockName = 'ssm/section-wrapper',
        postTypes = ['page', 'post', 'ssm_design_system', 'wp_block'],
    ) {
        this.rootBlockName = rootBlockName;
        this.postTypes = postTypes;
    }

    add() {
        addFilter(
            'blocks.registerBlockType',
            this.name,
            (blockSettings, blockName) => {
                if (blockName !== 'core/column') {
                    return blockSettings;
                }

                // get all blockTypes
                blockSettings.allowedBlocks = getBlockTypes()
                    ?.filter((allowedBlock) => {
                        const isRootBlock = allowedBlock.name === this.rootBlockName;
                        const hasParent = !!allowedBlock?.parent;

                        return !isRootBlock && !hasParent;
                    })
                    ?.map(allowedBlock => allowedBlock.name);

                return blockSettings;
            },
        );

        this.isAdded = true;
    }

    remove() {
        removeFilter('blocks.registerBlockType', this.name);
        this.isAdded = false;
    }
}
