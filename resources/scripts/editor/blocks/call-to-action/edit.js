import { useBlockProps, InspectorControls, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl } from '@wordpress/components';
import className from 'classnames';
import { ColorPaletteControl } from '@secretstache/wordpress-gutenberg';
import { TEMPLATE } from './index.js';
import { useCallback } from '@wordpress/element';

export const edit = ({ attributes, setAttributes }) => {
    const {
        backgroundColor,
        buttonPosition,
    } = attributes;

    const hasSelectedBackgroundColor = !!backgroundColor?.slug;

    const buttonPositionOnChange = useCallback((buttonPosition) => {
        setAttributes({ buttonPosition });
    }, []);

    const blockProps = useBlockProps({
        className: className({
            [`bg-${backgroundColor?.slug}`]: hasSelectedBackgroundColor,
        }),
    });

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: className('wp-block-ssm-call-to-action__inner', {
                'direction-bottom': buttonPosition === 'bottom',
                'direction-right': buttonPosition === 'right',
            }),
        },
        {
            allowedBlocks: ['core/heading', 'core/paragraph', 'core/buttons', 'core/columns'],
            template: TEMPLATE,
            templateLock: 'all',
            renderAppender: false,
        },
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <ColorPaletteControl
                        label="Background Color"
                        value={backgroundColor?.value}
                        attributeName="backgroundColor"
                        setAttributes={setAttributes}
                        // allowedColors={['white']}
                    />
                    <RadioControl
                        label="Button Position"
                        selected={buttonPosition}
                        options={[
                            { label: 'Bottom', value: 'bottom' },
                            { label: 'Right', value: 'right' },
                        ]}
                        onChange={buttonPositionOnChange}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div {...innerBlocksProps} />
            </div>
        </>
    );
};
