import {
    InnerBlocks,
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useCallback, useEffect, useState } from '@wordpress/element';
import {
    PanelBody,
    __experimentalDivider as Divider,
    ToggleControl,
    BaseControl,
    SelectControl,
    RadioControl,
    TextControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import classNames from 'classnames';
import {
    InsertBlockToolbar,
    ResponsiveSpacingControl,
    ColorPaletteControl,
    getSpacingClasses,
    EmptyBlockAppender,
    useAllowedBlocks,
    MediaControl,
} from '@secretstache/wordpress-gutenberg';

import { isSomeColorDark } from '@scripts/editor/utils/index.js';

export const edit = ({ name: blockName, attributes, setAttributes, clientId }) => {
    const {
        backgroundType,
        backgroundColor,
        backgroundImage,
        focalPoint,
        backgroundVideoSource,
        externalBackgroundVideoUrl,
        backgroundVideo,
        isIncludeOverlay,
        overlayColor,
        isFullViewportHeight,
        spacing,
    } = attributes;

    const isBackgroundTypeImage = backgroundType === 'image';
    const isBackgroundTypeVideo = backgroundType === 'video';
    const isBackgroundTypeColor = backgroundType === 'color';

    const hasSelectedBackgroundImage = isBackgroundTypeImage && backgroundImage?.url;

    const hasSelectedBackgroundColor = isBackgroundTypeColor && !!backgroundColor?.slug;

    const isBackgroundVideoSourceFile = backgroundVideoSource === 'file';
    const isBackgroundVideoSourceExternal = backgroundVideoSource === 'external';

    const hasSelectedBackgroundVideo = isBackgroundTypeVideo && ((isBackgroundVideoSourceFile && backgroundVideo?.url) || (isBackgroundVideoSourceExternal && externalBackgroundVideoUrl));

    const hasSelectedBackgroundMedia = hasSelectedBackgroundImage || hasSelectedBackgroundVideo;
    const hasSelectedBackground = hasSelectedBackgroundColor || hasSelectedBackgroundMedia;

    const hasSelectedOverlayColor = isIncludeOverlay && !!overlayColor?.slug;

    const onBackgroundTypeChange = useCallback((mediaType) => {
        setAttributes({ backgroundType: mediaType });
    }, []);

    const onBackgroundImageSelect = useCallback((media) => {
        setAttributes({
            backgroundImage: {
                id: media?.id,
                url: media?.url,
                alt: media?.alt,
            },
        });
    }, []);

    const onBackgroundImageRemove = useCallback(() => {
        setAttributes({
            backgroundImage: {
                id: null,
                url: null,
                alt: null,
            },
        });
    }, []);

    const onBackgroundVideoSourceChange = useCallback((backgroundVideoSource) => {
        setAttributes({ backgroundVideoSource });
    }, []);

    const onExternalBackgroundVideoUrlChange = useCallback((externalBackgroundVideoUrl) => {
        setAttributes({ externalBackgroundVideoUrl });
    }, []);

    const onBackgroundVideoSelect = useCallback((media) => {
        setAttributes({
            backgroundVideo: {
                id: media?.id,
                url: media?.url,
            },
        });
    }, []);

    const onBackgroundVideoRemove = useCallback(() => {
        setAttributes({
            backgroundVideo: {
                id: null,
                url: null,
            },
        });
    }, []);

    const onIncludeOverlayChange = () => setAttributes({ isIncludeOverlay: !isIncludeOverlay });

    const onIsFullViewportHeightChange = () => setAttributes({ isFullViewportHeight: !isFullViewportHeight });

    const onSpacingChange = useCallback((spacing) => {
        setAttributes({ spacing });
    }, []);

    const onFocalPointChange = useCallback((focalPoint) => {
        setAttributes({ focalPoint });
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

    const isLightAppender = hasSelectedBackgroundMedia || (hasSelectedBackgroundColor && isSomeColorDark([ backgroundColor?.slug ]))

    const blockProps = useBlockProps({
        className: classNames(
            '',
            getSpacingClasses(spacing, { desktopPrefix: 'md:', mobilePrefix: 'max-md:', valuePrefix: 'ssm-',}),
            {
                'has-background': hasSelectedBackground,
                'min-h-screen': isFullViewportHeight,
                [`bg-${backgroundColor?.slug}`]: hasSelectedBackgroundColor,
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
                    <SelectControl
                        label="Background Type"
                        value={backgroundType}
                        onChange={onBackgroundTypeChange}
                        options={[
                            { label: 'Color', value: 'color' },
                            { label: 'Image', value: 'image' },
                            { label: 'Video', value: 'video' },
                        ]}
                    />

                    {
                        isBackgroundTypeColor && (
                            <ColorPaletteControl
                                label="Background Color"
                                value={backgroundColor?.value}
                                attributeName="backgroundColor"
                                setAttributes={setAttributes}
                                allowedColors={['white', 'black']}
                            />
                        )
                    }

                    {
                        isBackgroundTypeImage && (
                            <>
                                <MediaControl
                                    type="image"
                                    label="Background Image"
                                    mediaId={backgroundImage?.id}
                                    mediaUrl={backgroundImage?.url}
                                    onSelect={onBackgroundImageSelect}
                                    onRemove={onBackgroundImageRemove}
                                    hasFocalPoint={!!backgroundImage?.id}
                                    focalPoint={focalPoint}
                                    onFocalPointChange={onFocalPointChange}
                                />

                                <Divider />

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
                                            allowedColors={['white', 'black']}
                                        />
                                    )
                                }
                            </>
                        )
                    }

                    {
                        isBackgroundTypeVideo && (
                            <>
                                <RadioControl
                                    label="Video Source"
                                    selected={backgroundVideoSource}
                                    options={[
                                        { label: 'File', value: 'file' },
                                        { label: 'External URL', value: 'external' },
                                    ]}
                                    onChange={onBackgroundVideoSourceChange}
                                />

                                <Divider />

                                {
                                    isBackgroundVideoSourceFile && (
                                        <MediaControl
                                            type="video"
                                            label="Background Video"
                                            mediaId={backgroundVideo?.id}
                                            mediaUrl={backgroundVideo?.url}
                                            onSelect={onBackgroundVideoSelect}
                                            onRemove={onBackgroundVideoRemove}
                                        />
                                    )
                                }

                                {
                                    isBackgroundVideoSourceExternal && (
                                        <TextControl
                                            label="Video URL"
                                            value={externalBackgroundVideoUrl}
                                            onChange={onExternalBackgroundVideoUrlChange}
                                        />
                                    )
                                }
                            </>
                        )
                    }

                    <Divider />

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
                {hasSelectedBackgroundMedia && (
                    <div className="wp-block-ssm-section-wrapper__background absolute inset-0 pointer-events-none overflow-hidden">
                        {hasSelectedBackgroundImage && (
                            <img
                                src={backgroundImage.url}
                                alt={backgroundImage?.alt || 'background image'}
                                className="w-full h-full object-cover transform transition-transform duration-100"
                                style={{
                                    'object-position': `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
                                }}
                            />
                        )}

                        {hasSelectedBackgroundVideo && (
                            <video
                                src={isBackgroundVideoSourceFile ? backgroundVideo.url : externalBackgroundVideoUrl}
                                autoPlay
                                playsInline
                                muted
                                loop
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                )}

                <div {...innerBlocksProps}>
                    {innerBlocksProps.children}

                    {
                        hasInnerBlocks
                            ? <InnerBlocks.DefaultBlockAppender/>
                            : <EmptyBlockAppender title="This section is empty" isLight={isLightAppender} />
                    }
                </div>
            </div>
        </>
    );
};
