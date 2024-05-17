import { MediaUpload, MediaUploadCheck, MediaPlaceholder } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export const ImageActions = ({
    imageId,
    imageUrl,
    imageAlt,
    placeholder = false,
    onSelectImage,
    onRemoveImage,
    className = '',
}) => {
    const hasImage = imageId && imageUrl;

    return (
        <MediaUploadCheck>
            <MediaUpload
                onSelect={onSelectImage}
                allowedTypes={['image']}
                value={imageId}
                render={({ open }) => {
                    return hasImage ? (
                        <div className={`bc-image-wrapper ${className}`}>
                            <img src={imageUrl} alt={imageAlt} onClick={open} />
                            <div className="bc-image-wrapper__actions">
                                <Button
                                    className="bc-image-wrapper__btn bc-image-wrapper__replace-btn"
                                    type="button"
                                    onClick={open}
                                >
                                    Replace
                                </Button>
                                <Button
                                    className="bc-image-wrapper__btn bc-image-wrapper__remove-btn"
                                    type="button"
                                    onClick={onRemoveImage}
                                >
                                    Remove
                                </Button>
                            </div>
                            <div className="bc-image-wrapper__overlay" />
                        </div>
                    ) : placeholder ? (
                        <MediaPlaceholder
                            className="media-placeholder"
                            icon="format-image"
                            onSelect={onSelectImage}
                            allowedTypes={['image']}
                            labels={{
                                title: 'Image',
                                instructions: 'Upload an image file or pick one from your media library.',
                            }}
                        />
                    ) : null;
                }}
            />
        </MediaUploadCheck>
    );
};
