import {
    InspectorControls,
    useBlockProps,
    MediaReplaceFlow,
    BlockControls,
} from '@wordpress/block-editor';
import { PanelBody, RadioControl } from '@wordpress/components';
import { useCallback, useMemo } from '@wordpress/element';
import { IconPicker, getImage, MediaControl } from '@secretstache/wordpress-gutenberg';

import {
    ICON_SIZE,
    getSizeClass,
    getSizeValue,
    resizeSvg,
} from './index.js';

export const edit = ({ attributes, setAttributes }) => {
    const { media, svgCode, size } = attributes;

    const blockProps = useBlockProps({ className: getSizeClass(size) });

    const onIconRemove = useCallback(() => {
        setAttributes({
            media: { id: null, url: '', alt: '', filename: '' },
            svgCode: '',
        });
    }, []);

    const onIconSelect = useCallback(async (selectedMedia) => {
        try {
            const imagePayload = await getImage(selectedMedia);

            const newMedia = {
                id: selectedMedia.id,
                url: selectedMedia.url,
                alt: selectedMedia.alt,
                filename: selectedMedia.filename || '',
            };

            if (imagePayload.isSvg) {
                setAttributes({
                    media: newMedia,
                    svgCode: imagePayload.svgCode,
                });
            } else {
                setAttributes({
                    media: newMedia,
                    svgCode: '',
                });
            }
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }, []);

    const onSizeChange = useCallback((newSize) => setAttributes({ size: newSize }), []);

    const resizedSvgCode = useMemo(() =>
        svgCode ? resizeSvg(svgCode, getSizeValue(size)) : '',
    [ svgCode, size ]);

    return (
        <>
            <BlockControls group="other">
                <MediaReplaceFlow
                    mediaId={media.id}
                    mediaURL={media.url}
                    accept="image/*"
                    allowedTypes={['image']}
                    onSelect={onIconSelect}
                    name={media.id ? 'Replace' : 'Add'}
                />
            </BlockControls>

            <InspectorControls>
                <PanelBody title="Settings">
                    <RadioControl
                        label="Size"
                        selected={size}
                        options={[
                            { label: 'Small', value: ICON_SIZE.SMALL },
                            { label: 'Medium', value: ICON_SIZE.MEDIUM },
                            { label: 'Large', value: ICON_SIZE.LARGE },
                        ]}
                        onChange={onSizeChange}
                    />

                    <MediaControl
                        mediaId={media.id}
                        mediaUrl={media.url}
                        mediaFileName={media.filename}
                        onSelect={onIconSelect}
                        onRemove={onIconRemove}
                        selectButtonLabel="Select Icon"
                        removeButtonLabel="Remove Icon"
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <IconPicker
                    imageId={media.id}
                    imageUrl={media.url}
                    imageAlt={media.alt}
                    svgCode={resizedSvgCode}
                    onSelect={onIconSelect}
                    onRemove={onIconRemove}
                />
            </div>
        </>
    );
};
