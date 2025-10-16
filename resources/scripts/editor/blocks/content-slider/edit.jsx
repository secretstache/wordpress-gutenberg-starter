import {
    useBlockProps,
    useInnerBlocksProps,
    InspectorControls,
    InnerBlocks,
    BlockControls,
} from '@wordpress/block-editor';
import { PanelBody, ToolbarButton } from '@wordpress/components';
import { useCallback, useMemo, useEffect, useRef } from '@wordpress/element';
import { getBlockContent } from '@wordpress/blocks';
import { select, useSelect } from '@wordpress/data';
import classNames from 'classnames';
import { useSlider, PreviewControl } from '@secretstache/wordpress-gutenberg';

import { SplideContext } from './index.jsx';
import { BrushIcon } from '../../components/icons.jsx';

const setupSlider = () => console.log('setup slider');

export const edit = ({ attributes, setAttributes, clientId }) => {
    const { isPreview } = attributes;
    const sliderRef = useRef(null);

    const onIsPreviewChange = useCallback(() => setAttributes({ isPreview: !isPreview }), [ isPreview ]);

    const isSidebarOpened = useSelect(
        (select) => select('core/edit-post').isEditorSidebarOpened(),
        [],
    );

    const { sliderElRef } = useSlider({
        isEnabled: isPreview,
        setupSlider: (el) => setupSlider(el),
    }, [ isPreview ]);

    useEffect(() => {
        if (isPreview && sliderElRef?.current) {
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
            className: 'splide__list',
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
        className: classNames({
            'is-preview': isPreview,
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
                </PanelBody>
            </InspectorControls>

            <BlockControls group="inline">
                <ToolbarButton
                    icon={BrushIcon}
                    onClick={onIsPreviewChange}
                    isActive={isPreview}
                />
            </BlockControls>

            <SplideContext.Provider value={{ isPreview }}>
                <div {...blockProps} ref={sliderRef}>
                    {
                        isPreview ? (
                            <div
                                className="splide"
                                ref={sliderElRef}
                            >
                                <div className="splide__track">
                                    <div
                                        className="splide__list"
                                        dangerouslySetInnerHTML={{ __html: innerBlocksHTML }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div {...innerBlocksProps}>
                                {innerBlocksProps.children}
                            </div>
                        )
                    }
                </div>

                {!isPreview && <InnerBlocks.ButtonBlockAppender/>}
            </SplideContext.Provider>
        </>
    );
};
