import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    InnerBlocks,
    BlockControls,
} from '@wordpress/block-editor';
import { PanelBody, ToolbarButton } from '@wordpress/components';
import { useCallback, useMemo, useEffect, useRef, createContext } from '@wordpress/element';
import { brush as brushIcon } from '@wordpress/icons';
import { getBlockContent } from '@wordpress/blocks';
import { select, useSelect } from '@wordpress/data';
import classNames from 'classnames';
import { useSlider, PreviewControl, ColorPaletteControl } from '@secretstache/wordpress-gutenberg';

import { setupSlider } from '@scripts/client/blocks/content-slider';
import { RadioControl } from '@wordpress/components';

export const SplideContext = createContext();

export const edit = ({ attributes, setAttributes, clientId }) => {
    const { isPreview, carouselColor, layoutType } = attributes;
    const sliderRef = useRef(null);

    const onIsPreviewChange = useCallback(() => setAttributes({ isPreview: !isPreview }), [ isPreview ]);

    const onLayoutChange = useCallback((newLayout) => setAttributes({ layoutType: newLayout }), []);

    const isSidebarOpened = useSelect(
        (select) => select('core/edit-post').isEditorSidebarOpened(),
        [],
    );

    const { sliderElRef } = useSlider({
        isEnabled: isPreview,
        setupSlider: (el) => setupSlider(el, layoutType),
    }, [ layoutType, isSidebarOpened ]);

    useEffect(() => {
        if (isPreview && sliderElRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                if (sliderElRef.current.splide) {
                    sliderElRef.current.splide.refresh();
                }
            });

            resizeObserver.observe(sliderElRef.current);
            resizeObserver.observe(document.body);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [ isPreview, isSidebarOpened ]);

    const { ...innerBlocksProps } = useInnerBlocksProps(
        {
            className: classNames('splide__list w-full', {
                'grid auto-rows-auto gap-4': !isPreview,
            }),
        },
        {
            allowedBlocks: ['ssm/slide'],
            template: [
                ['ssm/slide'],
                ['ssm/slide'],
                ['ssm/slide'],
            ],
            orientation: 'horizontal',
            renderAppender: false,
        },
    );

    const innerBlocksHTML = useMemo(() => {
        if (!isPreview) return null;

        return select('core/block-editor').getBlocks(clientId)
            .map(block => getBlockContent(block))
            .join('');
    }, [ isPreview ]);

    const blockProps = useBlockProps({
        className: classNames('layout-carousel w-full', {
            [`splide-color-${carouselColor?.slug}`]: carouselColor?.slug,
            'is-preview': isPreview,
            'is-full-width': layoutType === 'full-width',
        }),
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    <PreviewControl
                        checked={isPreview}
                        onChange={onIsPreviewChange}
                    />

                    <RadioControl
                        label="Layout"
                        selected={layoutType}
                        options={[
                            { label: 'Default', value: 'default' },
                            { label: 'Full Width', value: 'full-width' },
                        ]}
                        onChange={onLayoutChange}
                        disabled={isPreview}
                    />

                    {
                        isPreview && (
                            <ColorPaletteControl
                                label="Color Profile"
                                value={carouselColor?.value}
                                attributeName="carouselColor"
                                setAttributes={setAttributes}
                                allowedColors={['primary-500', 'secondary-500', 'tertiary-500']}
                            />
                        )
                    }
                </PanelBody>
            </InspectorControls>

            <BlockControls group="inline">
                <ToolbarButton
                    icon={brushIcon}
                    onClick={onIsPreviewChange}
                    isActive={isPreview}
                />
            </BlockControls>

            <SplideContext.Provider value={{ isPreview, layoutType }}>
                <div {...blockProps} ref={sliderRef}>
                    {isPreview ? (
                        <div
                            className={classNames(
                            "splide",
                            { "w-full": layoutType === 'full-width' },
                        )}
                            ref={sliderElRef}
                    >
                            <div
                                className={classNames(
                                "splide__track",
                                {
                                    "mx-auto max-w-[800px] overflow-visible": layoutType === 'default',
                                    "w-full": layoutType === 'full-width',
                                },
                            )}
                        >
                                <div
                                    className="splide__list w-full"
                                    dangerouslySetInnerHTML={{ __html: innerBlocksHTML }}
                            />
                            </div>
                        </div>
                ) : (
                    <div
                        className={classNames({
                            "scroll-shadow": layoutType === 'default',
                            "w-full": layoutType === 'full-width',
                        })}
                    >
                        <div {...innerBlocksProps}>
                            {innerBlocksProps.children}
                        </div>
                    </div>
                )}
                </div>

                {!isPreview && <InnerBlocks.ButtonBlockAppender />}
            </SplideContext.Provider>
        </>
    );
};
