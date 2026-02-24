import {
    BlockControls,
    InspectorControls,
    MediaReplaceFlow,
    MediaUpload,
    MediaUploadCheck,
    useBlockProps,
    MediaPlaceholder,
    __experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import {
    Button,
    PanelBody,
    ToolbarButton,
} from '@wordpress/components';
import { useCallback, useMemo, useRef, useEffect } from '@wordpress/element';
import { plus as plusIcon, brush as brushIcon } from '@wordpress/icons';
import classNames from 'classnames';
import { PreviewControl } from '@secretstache/wordpress-gutenberg';

import { Logo } from './components/Logo.jsx';

const initLogoWall = () => {
    console.log('initLogoWall');
};

export const edit = ({ attributes, setAttributes }) => {
    const { logos, isPreview } = attributes;

    const onImagesSelect = useCallback((newImages) => {

        const existingById = logos?.reduce((acc, logo) => {
            acc[logo.id] = logo;

            return acc;
        }, {}) || {};

        const mergedLogos = newImages.map((image) => {
            const existing = existingById[image.id];

            return {
                id: image.id,
                url: image?.sizes?.full?.url || image.url,
                alt: image.alt || '',
                width: image?.sizes?.full?.width || '100%',
                height: image?.sizes?.full?.height || '100%',
                linkSource: existing?.linkSource ?? '',
                linkIsOpenInNewTab: existing?.linkIsOpenInNewTab ?? false,
                linkTitle: existing?.linkTitle ?? '',
            };
        });

        setAttributes({ logos: mergedLogos });
    }, [ logos ]);

     const onLinkChange = useCallback((index, newLink) => {
        const updatedLogos = [...logos];

        updatedLogos[index] = {
            ...updatedLogos[index],
            linkSource: newLink?.url || '',
            linkIsOpenInNewTab: newLink?.opensInNewTab || false,
            linkTitle: newLink?.title ?? '',
        };

        setAttributes({ logos: updatedLogos });
    }, [ logos ]);

    const onLinkRemove = useCallback((index) => {
        const updatedLogos = [...logos];

        updatedLogos[index] = {
            ...updatedLogos[index],
            linkSource: '',
            linkIsOpenInNewTab: false,
            linkTitle: '',
        };

        setAttributes({ logos: updatedLogos });
    }, [ logos ]);

    const onIsPreviewChange = useCallback(() => {
        setAttributes({ isPreview: !isPreview});
    }, [ isPreview ]);

    const mediaIds = useMemo(() => logos?.map(logo => logo.id) || [], [ logos ]);

    const hasSelectedLogos = mediaIds?.length > 0;

    const blockRef = useRef(null);
    const sliderInstance = useRef(null);

    useEffect(() => {
        if (hasSelectedLogos && isPreview && blockRef?.current && !sliderInstance.current) {
            sliderInstance.current = initLogoWall(blockRef.current);
        }

        return () => {
            if (sliderInstance.current) {
                sliderInstance.current?.destroy();
                sliderInstance.current = null;
            }
        };
    }, [ mediaIds, blockRef, isPreview ]);

    const blockProps = useBlockProps({
        className: classNames({
            'is-preview': isPreview,
        }),
        ref: blockRef,
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
                                    key={logo.id}
                                    value={{
                                        url: logo.linkSource,
                                        opensInNewTab: logo.linkIsOpenInNewTab,
                                        title: logo.linkTitle,
                                    }}
                                    onChange={(newLink) => onLinkChange(index, newLink)}
                                    onRemove={() => onLinkRemove(index)}
                                    settings={[
                                        {
                                            id: 'opensInNewTab',
                                            title: 'Open in new tab',
                                            isToggle: true,
                                        },
                                    ]}
                                    showSuggestions={true}
                                    suggestionsQuery={{
                                        type: 'post',
                                        subtype: ['page', 'post'],
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

            <div {...blockProps} data-logo-wall>
                {
                    hasSelectedLogos && (
                        isPreview ? (
                            <div className="splide">
                                <div className="splide__track">
                                    <ul className="splide__list">
                                        {
                                            logos.map((logo) => (
                                                <li
                                                    key={logo.id}
                                                    className="splide__slide flex items-center justify-center"
                                                >
                                                    <Logo logo={logo} setLink={false} />
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-6 gap-4">
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
                            </div>
                        )
                    )
                }

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
