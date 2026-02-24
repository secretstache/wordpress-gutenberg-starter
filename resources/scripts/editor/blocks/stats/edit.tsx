import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import {
    PanelBody,
    TextControl,
    __experimentalNumberControl as NumberControl,
    __experimentalDivider as Divider,
} from '@wordpress/components';
import { useCallback } from '@wordpress/element';

import { EditProps } from '@scripts/editor/types';
import type { Attributes } from './types/index';

export const edit = ({ attributes, setAttributes }: EditProps<Attributes>) => {
    const {
        prependedData,
        value,
        appendedData,
    } = attributes;

    const onPrependedDataChange = useCallback((prependedData: string) => {
        setAttributes({ prependedData });
    }, []);

    const onValueChange = useCallback((value: string | undefined) => {
        setAttributes({ value });
    }, []);

    const onAppendedDataChange = useCallback((appendedData: string) => {
        setAttributes({ appendedData });
    }, []);

    const blockProps = useBlockProps({
        className: 'flex',
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <TextControl
                        label="Prepend Data"
                        value={prependedData}
                        onChange={onPrependedDataChange}
                    />

                    <Divider />

                    <NumberControl
                        label="Value"
                        value={value}
                        onChange={onValueChange}
                    />

                    <Divider />

                    <TextControl
                        label="Append Data"
                        value={appendedData}
                        onChange={onAppendedDataChange}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="wp-block-ssm-stats__number-wrapper">
                    <RichText
                        tag="span"
                        value={prependedData}
                        className="wp-block-ssm-stats__prependData"
                        onChange={onPrependedDataChange}
                        placeholder="+"
                        allowedFormats={[]}
                    />

                    <span className="wp-block-ssm-stats__number">
                        <span className="js-animated-number" data-number={value}>{value}</span>
                    </span>

                    <RichText
                        tag="span"
                        value={appendedData}
                        className="wp-block-ssm-stats__appendData"
                        onChange={onAppendedDataChange}
                        placeholder="%"
                        allowedFormats={[]}
                    />
                </div>
            </div>
        </>
    );
};
