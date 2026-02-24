import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { SaveProps } from '@scripts/editor/types';

export const save = ({ attributes }: SaveProps<{ hasInnerBlocks: boolean }>) => {
    const { hasInnerBlocks } = attributes;

    if (!hasInnerBlocks) {
        return null;
    }

    const blockProps = useBlockProps.save({
        className: 'wp-block-ssm-block-grid__item',
    });

    const innerBlocksProps = useInnerBlocksProps.save(blockProps);

    return (
        <div {...innerBlocksProps} />
    );
};
