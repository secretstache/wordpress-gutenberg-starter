import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import { getGridClass } from './index.js';

export const save = ({ attributes }) => {
    const { columnsPerRow } = attributes;

    const blockProps = useBlockProps.save({
        className: `grid gap-6 ${getGridClass(columnsPerRow)}`,
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
};
