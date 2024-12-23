import {
    useBlockProps,
    InspectorControls,
    useInnerBlocksProps,
    InnerBlocks,
    useSetting,
} from '@wordpress/block-editor';
import { PanelBody, RadioControl, ToggleControl, FontSizePicker, BaseControl } from '@wordpress/components';
import { createContext, useState, useRef, useEffect, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import classNames from 'classnames';

import { LAYOUT_TYPE } from './index.js';

const ALLOWED_BLOCKS = ['ssm/accordion-item'];

const TEMPLATE = [
    ['ssm/accordion-item'],
    ['ssm/accordion-item'],
];

export const AccordionContext = createContext();

export const edit = ({ attributes, setAttributes, clientId }) => {
    const { layoutType, isOpenedByDefault } = attributes;

    const [ activeItemClientId, setActiveItemClientId ] = useState(null);

    const blockRef = useRef(null);

    const { childBlocks } = useSelect(select => ({
        childBlocks: select('core/block-editor').getBlocks(clientId),
    }), []);

    useEffect(() => {
        if (isOpenedByDefault) {
            const firstItemId = childBlocks?.[0]?.clientId;
            setActiveItemClientId(firstItemId);
        } else {
            setActiveItemClientId(null);
        }
    }, [ isOpenedByDefault ]);

    const onOpenByDefaultChange = useCallback(() => {
        setAttributes({ isOpenedByDefault: !isOpenedByDefault });
    }, [ isOpenedByDefault ]);

    const onLayoutTypeChange = useCallback((layoutType) => {
        setAttributes({ layoutType })
    }, []);

    const isHorizontal = layoutType === LAYOUT_TYPE.HORIZONTAL;

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
        <AccordionContext.Provider value={{ layoutType, activeItemClientId, setActiveItemClientId }}>
            <InspectorControls>
                <PanelBody title="Settings">
                    <RadioControl
                        label="Layout"
                        selected={layoutType}
                        options={[
                            { label: 'Vertical', value: LAYOUT_TYPE.VERTICAL },
                            { label: 'Horizontal', value: LAYOUT_TYPE.HORIZONTAL },
                        ]}
                        onChange={onLayoutTypeChange}
                    />

                    <ToggleControl
                        label="Initially opened"
                        checked={isOpenedByDefault}
                        onChange={onOpenByDefaultChange}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...innerBlocksProps}>
                <div className={classNames('mt-10', {
                    'horizontal': isHorizontal,
                    'vertical': !isHorizontal,
                })}>
                    { innerBlocksProps.children }
                </div>

                <InnerBlocks.DefaultBlockAppender />
            </div>

        </AccordionContext.Provider>
    );
};
