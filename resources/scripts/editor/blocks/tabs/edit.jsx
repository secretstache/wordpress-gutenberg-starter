import {
    useBlockProps,
    InspectorControls,
    useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, RadioControl, Slot } from '@wordpress/components';
import { useState, useRef, useEffect, useCallback } from '@wordpress/element';
import { ColorPaletteControl, useTabs } from '@secretstache/wordpress-gutenberg';
import classNames from 'classnames';

import { LAYOUT_TYPE, TabsContext } from './index.js';

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

    const isLayoutTypeVertical = layoutType === LAYOUT_TYPE.VERTICAL;
    const isLayoutTypeHorizontal = layoutType === LAYOUT_TYPE.HORIZONTAL;

    const blockProps = useBlockProps({
        ref: blockRef,
        className: classNames({
            'is-vertical': isLayoutTypeVertical,
            [`tabs-color-${tabItemColor?.slug}`]: tabItemColor?.slug,
        }),
    });

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: classNames('wp-block-ssm-tabs__content'),
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
                            { label: 'Vertical', value: LAYOUT_TYPE.VERTICAL },
                            { label: 'Horizontal', value: LAYOUT_TYPE.HORIZONTAL },
                        ]}
                        onChange={onLayoutTypeChange}
                    />

                    <ColorPaletteControl
                        label="Color Profile"
                        value={tabItemColor?.value}
                        attributeName="tabItemColor"
                        setAttributes={setAttributes}
                        // allowedColors={['white']}
                    />
                </PanelBody>
            </InspectorControls>

            <TabsContext.Provider value={{ activeItemId, setActiveItemId, layoutType }}>
                <div {...blockProps}>
                    <div className="wp-block-ssm-tabs__container">
                        <Slot
                            key={slotKey}
                            className="wp-block-ssm-tabs__nav"
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
