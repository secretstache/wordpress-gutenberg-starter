import {
    useBlockProps,
    InspectorControls,
    useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
} from '@wordpress/components';

import { EditProps } from '@scripts/editor/types';
import { Attributes } from './types';
import { useCallback } from "@wordpress/element";

const ALLOWED_BLOCKS = ['ssm/block-grid-item'];

const TEMPLATE = [
    ['ssm/block-grid-item'],
    ['ssm/block-grid-item'],
    ['ssm/block-grid-item'],
];

export const edit = ({ attributes, setAttributes }: EditProps<Attributes>) => {
    const { columnsPerRow } = attributes;

    const onColumnsPerRowChange = useCallback((columnsPerRow: number | undefined): void =>  {
        setAttributes({ columnsPerRow });
    }, []);

    const blockProps = useBlockProps({
        className: `flex flex-wrap gap-medium cols-${columnsPerRow}`,
    });

    const innerBlocksProps = useInnerBlocksProps(
        blockProps,
        {
            allowedBlocks: ALLOWED_BLOCKS,
            template: TEMPLATE,
            orientation: 'horizontal',
        },
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <RangeControl
                        label="Columns Per Row"
                        value={columnsPerRow}
                        onChange={onColumnsPerRowChange}
                        min={2}
                        max={5}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...innerBlocksProps} />
        </>
    );
};
