import {
    useBlockProps,
    InspectorControls,
    useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, RadioControl, Slot } from '@wordpress/components';
import { useState, useRef, useEffect, useCallback } from '@wordpress/element';
import { ColorPaletteControl, useTabs } from '@secretstache/wordpress-gutenberg';
import classNames from 'classnames';

import { LAYOUT_TYPES, TabsContext } from './index.js';

export const edit = ({ attributes, setAttributes, clientId }) => {
    const { layoutType, tabItemColor } = attributes;

    const blockRef = useRef(null);

    const {
        tabs,
        tabsOrder,
        activeItemId,
        setActiveItemId,
        TabAppender,
    } = useTabs(clientId, 'ssm/tabs-item');

    const [ slotKey, setSlotKey ] = useState(0);

    useEffect(() => {
        setSlotKey((prevKey) => prevKey + 1);
    }, [ tabsOrder ]);

    useEffect(() => {
        setAttributes({ tabs });
    }, [ tabs ]);

    const onLayoutTypeChange = useCallback((newLayoutType) => setAttributes({ layoutType: newLayoutType }), []);

    const isLayoutTypeVertical = layoutType === LAYOUT_TYPES.VERTICAL;
    const isLayoutTypeHorizontal = layoutType === LAYOUT_TYPES.HORIZONTAL;

    const blockProps = useBlockProps({
        ref: blockRef,
        className: classNames({
            'is-vertical': isLayoutTypeVertical,
            [`tabs-color-${tabItemColor?.slug}`]: tabItemColor?.slug,
        }),
    });

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: classNames('wp-block-ssm-tabs__content', {
                'w-full md:w-3/4': isLayoutTypeVertical,
            }),
        },
        {
            allowedBlocks: ['ssm/tabs-item'],
            template: [
                ['ssm/tabs-item', { title: 'Tab 1' }],
                ['ssm/tabs-item', { title: 'Tab 2' }],
                ['ssm/tabs-item', { title: 'Tab 3' }],
            ],
            renderAppender: false,
            orientation: layoutType,
        },
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <RadioControl
                        label="Layout"
                        selected={layoutType}
                        options={[
                            { label: 'Vertical', value: LAYOUT_TYPES.VERTICAL },
                            { label: 'Horizontal', value: LAYOUT_TYPES.HORIZONTAL },
                        ]}
                        onChange={onLayoutTypeChange}
                    />

                    <ColorPaletteControl
                        label="Color Profile"
                        value={tabItemColor?.value}
                        attributeName="tabItemColor"
                        setAttributes={setAttributes}
                        allowedColors={['primary-500', 'secondary-500', 'tertiary-500']}
                    />
                </PanelBody>
            </InspectorControls>

            <TabsContext.Provider value={{ activeItemId, setActiveItemId, layoutType }}>
                <div {...blockProps}>
                    <div className={classNames('wp-block-ssm-tabs__container', {
                        'block md:flex md:gap-3': isLayoutTypeVertical,
                    })}>
                        <Slot
                            key={slotKey}
                            className={classNames('wp-block-ssm-tabs__nav isolate flex', {
                                'mb-2 md:mb-0 flex-row md:flex-col md:gap-2 w-full md:w-1/4': isLayoutTypeVertical,
                                'mb-2 divide-x divide-gray-200 rounded-lg shadow-md': isLayoutTypeHorizontal,
                            })}
                            bubblesVirtually={true}
                            name={`tabsNav-${clientId}`}
                        />

                        <div {...innerBlocksProps}>
                            {innerBlocksProps.children}
                        </div>
                    </div>

                    <TabAppender />
                </div>
            </TabsContext.Provider>
        </>
    );
};
