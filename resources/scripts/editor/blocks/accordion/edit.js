import {
    useBlockProps,
    InspectorControls,
    useInnerBlocksProps,
    InnerBlocks,
    useSetting,
} from '@wordpress/block-editor';
import { PanelBody, RadioControl, ToggleControl, FontSizePicker, BaseControl } from '@wordpress/components';
import { createContext, useState, useRef, useEffect, useCallback } from '@wordpress/element';

import classNames from 'classnames';
import { useSelect } from '@wordpress/data';

const ALLOWED_BLOCKS = ['ssm/accordion-item'];

const TEMPLATE = [
    ['ssm/accordion-item'],
    ['ssm/accordion-item'],
];

export const AccordionContext = createContext();

export const edit = ({ attributes, setAttributes, clientId }) => {
    const { layoutType, isOpenedByDefault, headingSize } = attributes;

    const [ activeItemClientId, setActiveItemClientId ] = useState(null);
    const [ headingSlug, setHeadingSlug ] = useState('base');

    const blockRef = useRef(null);

    const { childBlocks } = useSelect(select => ({
        childBlocks: select('core/block-editor').getBlocks(clientId),
    }), [ clientId ]);

    useEffect(() => {
        if (isOpenedByDefault) {
            const firstItemId = childBlocks?.[0]?.clientId;
            setActiveItemClientId(firstItemId);
        } else {
            setActiveItemClientId(null);
        }
    }, [ isOpenedByDefault ]);

    const onOpenByDefaultChange = useCallback(() => setAttributes({ isOpenedByDefault: !isOpenedByDefault }), [ isOpenedByDefault ]);

    const isHorizontal = layoutType === 'horizontal';

    const fontSizes = useSetting( 'typography.fontSizes' );

    useEffect(() => {
        if (headingSize) {
            const fontSize = fontSizes.find( fontSize => fontSize.size === headingSize);
            const slug = fontSize?.slug?.replace(/(\d)/g, '$1-');
            setHeadingSlug(slug);
        } else {
            setHeadingSlug('2-xl');
        }
    }, [ headingSize ]);

    const blockProps = useBlockProps({
        className: classNames('wp-block-ssm-accordion', {
            'is-horizontal': isHorizontal,
            'is-opened-by-default': isOpenedByDefault,
        }),
        ref: blockRef,
    });

    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        allowedBlocks: ALLOWED_BLOCKS,
        template: TEMPLATE,
        orientation: layoutType,
        renderAppender: false,
    });

    return (
        <AccordionContext.Provider value={{ layoutType, headingSlug, activeItemClientId, setActiveItemClientId }}>
            <InspectorControls>
                <PanelBody title="Settings">
                    <RadioControl
                        label="Layout"
                        selected={layoutType}
                        options={[
                            { label: 'Vertical', value: 'vertical' },
                            { label: 'Horizontal', value: 'horizontal' },
                        ]}
                        onChange={(layoutType) => setAttributes({ layoutType })}
                    />

                    <ToggleControl
                        label="Initially opened"
                        checked={isOpenedByDefault}
                        onChange={onOpenByDefaultChange}
                    />

                    <BaseControl
                        label="Title typography"
                        __nextHasNoMarginBottom={true}
                    >
                        <FontSizePicker
                            disableCustomFontSizes={true}
                            fontSizes={fontSizes}
                            value={headingSize}
                            onChange={(headingSize) => setAttributes({ headingSize })}
                        />
                    </BaseControl>

                </PanelBody>
            </InspectorControls>

            <div {...innerBlocksProps}>
                <div className={classNames('mt-10', {
                    'flex flex-wrap md:flex-nowrap': isHorizontal,
                    'divide-y divide-gray-900/10': !isHorizontal,
                })}>

                    { innerBlocksProps.children }

                </div>

                <InnerBlocks.DefaultBlockAppender />

            </div>

        </AccordionContext.Provider>
    );
};
