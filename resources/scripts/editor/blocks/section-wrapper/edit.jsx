import {
    InnerBlocks,
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useCallback } from '@wordpress/element';
import {
    PanelBody,
    __experimentalDivider as Divider,
    ToggleControl,
    BaseControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import classNames from 'classnames';
import {
    InsertBlockToolbar,
    ResponsiveSpacingControl,
    ColorPaletteControl,
    getSpacingClasses,
    MediaTypeControl,
    EmptyBlockAppender,
    useAllowedBlocks,
} from '@secretstache/wordpress-gutenberg';

export const edit = ({ name: blockName, attributes, setAttributes, clientId }) => {
    const {
        backgroundColor,
        isIncludeBackgroundMedia,
        backgroundMediaType = 'image',
        media,
        isIncludeOverlay,
        overlayColor,

        isFullViewportHeight,
        spacing,
    } = attributes;

    const isBackgroundTypeImage = backgroundMediaType === 'image';
    const isBackgroundTypeVideo = backgroundMediaType === 'video';

    const hasSelectedBackgroundImage = isBackgroundTypeImage && media?.url;
    const hasSelectedBackgroundVideo = isBackgroundTypeVideo && media?.url;
    const hasSelectedBackgroundColor = !!backgroundColor?.slug;

    const hasSelectedBackgroundMedia = hasSelectedBackgroundImage || hasSelectedBackgroundVideo;
    const hasSelectedBackground = hasSelectedBackgroundColor || hasSelectedBackgroundMedia;

    const hasSelectedOverlayColor = isIncludeOverlay && !!overlayColor?.slug;

    const onIncludeBackgroundMediaChange = useCallback(() => {
        setAttributes({
            isIncludeBackgroundMedia: !isIncludeBackgroundMedia,
        });
    }, [ isIncludeBackgroundMedia ]);

    const onBackgroundMediaTypeChange = useCallback((mediaType) => {
        setAttributes({ backgroundMediaType: mediaType, media: {} });
    }, []);

    const onMediaSelect = useCallback((media) => {
        setAttributes({ media: { id: media?.id, url: media?.url }, backgroundMediaType });
    }, [ backgroundMediaType ]);

    const onMediaRemove = useCallback(() => {
        setAttributes({ media: {} });
    }, []);

    const onIncludeOverlayChange = useCallback(() => {
        setAttributes({ isIncludeOverlay: !isIncludeOverlay });
    }, [ isIncludeOverlay ]);

    const onIsFullViewportHeightChange = useCallback(() => {
        setAttributes({ isFullViewportHeight: !isFullViewportHeight });
    }, [ isFullViewportHeight ]);

    const onSpacingChange = useCallback((spacing) => {
        setAttributes({ spacing });
    }, []);

    const allowedBlocks = useAllowedBlocks(blockName, blockName);

    const hasInnerBlocks = useSelect((select) => {
        const { getBlockOrder } = select('core/block-editor');

        return getBlockOrder(clientId).length > 0;
    }, []);

    const deviceType = useSelect(
        (select) => select('core/edit-post')?.__experimentalGetPreviewDeviceType?.() || 'Desktop',
        [],
    );

    const blockProps = useBlockProps({
        className: classNames(
            '',
            getSpacingClasses(spacing, 'spacing-', 'mobile-spacing-'),
            {
                'has-background': hasSelectedBackground,
                'h-screen': isFullViewportHeight,
            },
        ),
    });

    const { ...innerBlocksProps } = useInnerBlocksProps({
        className: 'wp-block-ssm-section-wrapper__content',
    }, {
        allowedBlocks,
        renderAppender: false,
    });

    return (
        <>
            <InsertBlockToolbar
                clientId={clientId}
                blockName={blockName}
                group="inline"
            />

            <InspectorControls>
                <PanelBody title="Settings">
                    <ColorPaletteControl
                        label="Background Color"
                        value={backgroundColor?.value}
                        attributeName="backgroundColor"
                        setAttributes={setAttributes}
                        // allowedColors={['white']}
                    />

                    <Divider margin={2} />

                    <ToggleControl
                        label="Include Background Media"
                        onChange={onIncludeBackgroundMediaChange}
                        checked={isIncludeBackgroundMedia}
                    />

                    {
                        isIncludeBackgroundMedia && (
                            <>
                                <MediaTypeControl
                                    label="Background Media"
                                    types={[ 'image', 'video' ]}
                                    selectedType={backgroundMediaType}
                                    onTypeChange={onBackgroundMediaTypeChange}
                                    mediaId={media?.id}
                                    mediaUrl={media?.url}
                                    onMediaSelect={onMediaSelect}
                                    onMediaRemove={onMediaRemove}
                                />

                                <Divider margin={2} />

                                <ToggleControl
                                    label="Include Overlay"
                                    onChange={onIncludeOverlayChange}
                                    checked={isIncludeOverlay}
                                />

                                {
                                    isIncludeOverlay && (
                                        <ColorPaletteControl
                                            label="Overlay Color"
                                            value={overlayColor?.value}
                                            attributeName="overlayColor"
                                            setAttributes={setAttributes}
                                            // allowedColors={['white']}
                                        />
                                    )
                                }
                            </>
                        )
                    }

                    <Divider margin={2} />

                    <BaseControl>
                        <ToggleControl
                            label="Full Height"
                            onChange={onIsFullViewportHeightChange}
                            checked={isFullViewportHeight}
                        />
                    </BaseControl>

                </PanelBody>

                <PanelBody title="Spacing">
                    <ResponsiveSpacingControl
                        min={-1}
                        max={6}
                        onChange={onSpacingChange}
                        value={spacing}
                        deviceType={deviceType}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {
                    hasSelectedBackgroundColor && (
                        <span
                            aria-hidden="true"
                            className={`wp-block-ssm-section-wrapper__background has-${backgroundColor?.slug}-background-color`}
                        />
                    )
                }

                {
                    isIncludeBackgroundMedia && hasSelectedBackgroundMedia && (
                        <div className={classNames('wp-block-ssm-section-wrapper__background', {
                            'has-overlay': hasSelectedOverlayColor,
                            [`has-${overlayColor?.slug}-overlay`]: hasSelectedOverlayColor,
                        })}>
                            <>
                                {
                                    hasSelectedBackgroundImage && (
                                        <img
                                            src={media.url}
                                            alt={media?.alt || 'background image'}
                                        />
                                    )
                                }

                                {
                                    hasSelectedBackgroundVideo && (
                                        <video
                                            src={media.url}
                                            autoPlay
                                            playsInline
                                            muted
                                            loop
                                        />
                                    )
                                }
                            </>
                        </div>
                    )
                }

                <div {...innerBlocksProps}>
                    {innerBlocksProps.children}

                    {
                        hasInnerBlocks
                            ? <InnerBlocks.DefaultBlockAppender/>
                            : <EmptyBlockAppender title="This section is empty"/>
                    }
                </div>
            </div>
        </>
    );
};
