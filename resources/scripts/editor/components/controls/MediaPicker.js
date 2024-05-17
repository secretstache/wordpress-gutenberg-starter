import { Button } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

export const BCImageRenderer = ({
    imageId,
    imageUrl,
    onImageClick,
    onRemoveClick,
    onSelectClick,
}) => {
    return imageId && imageUrl ? (
        <>
            <div className="bc-selected-media-wrapper">
                <img
                    src={imageUrl}
                    className="bc-selected-media bc-selected-media--image"
                    alt="Selected Image"
                    onClick={onImageClick}
                />
            </div>

            <Button
                className="bc-remove-btn"
                onClick={onRemoveClick}
                isSecondary
                isDestructive
            >
                Remove Image
            </Button>
        </>
    ) : (
        <Button
            variant="secondary"
            onClick={onSelectClick}
            className="bc-select-btn"
        >
            Select Image
        </Button>
    );
};

export const BCVideoRenderer = ({
    videoId,
    videoUrl,
    onRemoveClick,
    onSelectClick,
}) => {
    return videoId && videoUrl ? (
        <>
            <div className="bc-selected-media-wrapper">
                <video src={videoUrl} className="bc-selected-media bc-selected-media--video" controls />
            </div>

            <Button
                className="bc-remove-btn"
                onClick={onRemoveClick}
                isSecondary
                isDestructive
            >
                Remove Video
            </Button>
        </>
    ) : (
        <Button
            variant="secondary"
            onClick={onSelectClick}
            className="bc-select-btn"
        >
            Select Video
        </Button>
    );
};

const MEDIA_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video',
};

export const BCMediaPicker = ({
    mediaId,
    mediaUrl,
    onSelect,
    onRemove,
    type = MEDIA_TYPES.IMAGE,
    ...other
}) => {
    if (type === MEDIA_TYPES.IMAGE) {
        return (
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={onSelect}
                    allowedTypes={['image', 'image/svg+xml']}
                    accept="image/*"
                    value={mediaId}
                    render={({ open }) => (
                        <BCImageRenderer
                            imageId={mediaId}
                            imageUrl={mediaUrl}
                            onImageClick={open}
                            onSelectClick={open}
                            onRemoveClick={onRemove}
                        />
                    )}
                    { ...other }
                />
            </MediaUploadCheck>
        );
    } else if (type === MEDIA_TYPES.VIDEO) {
        return (
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={onSelect}
                    allowedTypes={['video']}
                    value={mediaId}
                    render={({ open }) => (
                        <BCVideoRenderer
                            videoId={mediaId}
                            videoUrl={mediaUrl}
                            onSelectClick={open}
                            onRemoveClick={onRemove}
                        />
                    )}
                    { ...other }
                />
            </MediaUploadCheck>
        );
    } else {
        throw new Error('Unrecognized media type.');
    }
};
