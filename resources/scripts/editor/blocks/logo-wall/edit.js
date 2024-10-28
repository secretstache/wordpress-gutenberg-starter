import {
    BlockControls,
    InspectorControls,
    MediaReplaceFlow,
    MediaUpload,
    MediaUploadCheck,
    useBlockProps,
    MediaPlaceholder,
} from '@wordpress/block-editor';
import {
    Button,
    PanelBody,
    ToolbarButton,
} from '@wordpress/components';
import { useCallback, useMemo } from '@wordpress/element';
import { plus as plusIcon, brush as brushIcon } from '@wordpress/icons';
import classNames from 'classnames';
import { LinkControl, useSlider, PreviewControl } from '@secretstache/wordpress-gutenberg';

import { initLogoWall } from '@scripts/client/blocks/logo-wall';
import { Logo } from './components/logo.js';

export const edit = ({ attributes, setAttributes }) => {
    const { logos, isPreview } = attributes;

    const { sliderElRef } = useSlider({
        isEnabled: isPreview && logos?.length,
        setupSlider: initLogoWall,
    }, [ isPreview, logos ]);

    const onImagesSelect = useCallback((newImages) => {
        const updatedLogos = newImages?.map((image) => ({
            id: image.id,
            url: image?.sizes?.full?.url || image.url,
            alt: image.alt || '',
            width: image?.sizes?.full?.width || '100%',
            height: image?.sizes?.full?.height || '100%',
            linkSource: '#',
            linkIsOpenInNewTab: false,
        }));

        setAttributes({ logos: updatedLogos });
    }, []);

    const updateLogoAttribute = useCallback((index, attribute, value) => {
        const updatedLogos = [...logos];
        updatedLogos[index] = { ...updatedLogos[index], [attribute]: value };

        setAttributes({ logos: updatedLogos });
    }, [ logos ]);

    const onIsPreviewChange = useCallback(() => {
        setAttributes({ isPreview: !isPreview});
    }, [ isPreview ]);

    const mediaIds = useMemo(() => logos?.map(logo => logo.id) || [], [ logos ]);

    const hasSelectedLogos = mediaIds?.length > 0;

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
                        disabled={!logos?.length}
                    />

                    {
                        logos.map((logo, index) => (
                            <PanelBody
                                key={logo.id}
                                title={logo.alt ? `Logo: ${logo.alt}` : `Logo ${index + 1}`}
                                initialOpen={false}
                            >
                                <LinkControl
                                    url={{
                                        value: logo.linkSource,
                                        attrName: 'linkSource',
                                    }}
                                    isOpenInNewTab={{
                                        value: logo.linkIsOpenInNewTab,
                                        attrName: 'linkIsOpenInNewTab',
                                    }}
                                    setAttributes={(updates) => {
                                        Object.entries(updates).forEach(([key, value]) => {
                                            updateLogoAttribute(index, key, value);
                                        });
                                    }}
                                />
                            </PanelBody>
                        ))
                    }
                </PanelBody>
            </InspectorControls>

            <BlockControls group="inline">
                <ToolbarButton
                    icon={brushIcon}
                    label="Toggle Preview"
                    onClick={onIsPreviewChange}
                    isActive={isPreview}
                    disabled={!hasSelectedLogos}
                />
            </BlockControls>

            {
                !isPreview && (
                    <BlockControls group="other">
                        <MediaReplaceFlow
                            group="inline"
                            accept="image/*"
                            allowedTypes={['image']}
                            onSelect={onImagesSelect}
                            name={logos?.length ? 'Update' : 'Add'}
                            multiple={true}
                            mediaIds={mediaIds}
                            addToGallery={!logos?.length}
                        />
                    </BlockControls>
                )
            }

            <div {...blockProps}>
                <div className={classNames('wp-block-ssm-logo-wall__wrapper', {
                    'mx-auto flex flex-wrap items-center justify-center gap-10': !isPreview,
                })}>
                    {
                        hasSelectedLogos && (
                            isPreview ? (
                                <div className="splide is-centered" ref={sliderElRef}>
                                    <div className="splide__track">
                                        <div className="splide__list items-center">
                                            {
                                                logos.map((logo) => (
                                                    <div
                                                        key={logo.id}
                                                        className="splide__slide"
                                                    >
                                                        <Logo logo={logo} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={onImagesSelect}
                                        allowedTypes={['image']}
                                        value={mediaIds}
                                        multiple={true}
                                        addToGallery={true}
                                        gallery={true}
                                        render={({ open }) => (
                                            <>
                                                {
                                                    logos.map((logo) => <Logo key={logo.id} logo={logo} />)
                                                }

                                                <Button
                                                    size="small"
                                                    onClick={open}
                                                    icon={plusIcon}
                                                    label="Add logo"
                                                    showTooltip={true}
                                                    variant="primary"
                                                />
                                            </>
                                        )}
                                    />
                                </MediaUploadCheck>
                            )
                        )
                    }
                </div>

                {
                    !hasSelectedLogos && !isPreview && (
                        <MediaPlaceholder
                            icon="format-image"
                            labels={{
                                title: 'Logo Wall',
                                instructions: 'Upload images or drag and drop them here to create your logo wall.',
                            }}
                            className="w-full"
                            onSelect={onImagesSelect}
                            accept="image/*"
                            allowedTypes={['image']}
                            multiple
                        />
                    )
                }
            </div>
        </>
    );
};
