import { useBlockProps, InspectorControls, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, RadioControl } from '@wordpress/components';
import className from 'classnames';
import { ColorPaletteControl } from '@secretstache/wordpress-gutenberg';
import { TEMPLATE } from './index.js';

export const edit = ({ attributes, setAttributes }) => {
    const {
        backgroundColor,
        buttonPosition,
    } = attributes;

    const hasSelectedBackgroundColor = !!backgroundColor?.slug;

    const blockProps = useBlockProps({
        className: className('px-10 sm:px-14 lg:px-20 py-24 sm:py-32 shadow-xl rounded-3xl', {
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
                        allowedColors={['white', 'gray-300', 'primary-500', 'secondary-500', 'tertiary-500']}
                    />
                    <RadioControl
                        label="Button Position"
                        selected={buttonPosition}
                        options={[
                            { label: 'Bottom', value: 'bottom' },
                            { label: 'Right', value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ buttonPosition: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div {...innerBlocksProps} />
            </div>
        </>
    );
};
