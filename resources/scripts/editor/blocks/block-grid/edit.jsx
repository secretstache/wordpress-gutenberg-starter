import { useBlockProps, InspectorControls, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, RadioControl } from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

import { getGridClass } from './index.js';

const ALLOWED_BLOCKS = ['ssm/block-grid-item'];

export const edit = ({ attributes, setAttributes, clientId }) => {
    const { columnsPerRow } = attributes;

    const blockProps = useBlockProps({
        className: `grid gap-6 ${getGridClass(columnsPerRow)}`,
    });

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        allowedBlocks: ALLOWED_BLOCKS,
        template: [
            ['ssm/block-grid-item'],
            ['ssm/block-grid-item'],
            ['ssm/block-grid-item'],
            ['ssm/block-grid-item'],
            ['ssm/block-grid-item'],
            ['ssm/block-grid-item'],
        ],
        renderAppender: InnerBlocks.DefaultBlockAppender,
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <RangeControl
                        label="Columns Per Row"
                        value={columnsPerRow}
                        onChange={(value) => setAttributes({ columnsPerRow: value })}
                        min={1}
                        max={4}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...innerBlocksProps} />
        </>
    );
};
