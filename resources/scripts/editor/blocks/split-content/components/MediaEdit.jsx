import { MediaPlaceholder } from '@wordpress/block-editor';
import classNames from 'classnames';
import { MEDIA_TYPE } from '@secretstache/wordpress-gutenberg';

export const MediaEdit = ({
    media,
    backgroundColor,
    backgroundMediaType,
    mediaPosition,
    onMediaSelect,
}) => {
    if (!media?.url) {
        return (
            <MediaPlaceholder
                icon="format-image"
                labels={{
                    title: 'Media',
                    instructions: 'Upload an image or video, or select one from your media library.',
                }}
                onSelect={onMediaSelect}
                accept={backgroundMediaType === 'image' ? 'image/*' : 'video/*'}
                allowedTypes={[ backgroundMediaType ]}
                multiple={false}
            />
        );
    }

    return (
        <div className="">
            {backgroundMediaType === MEDIA_TYPE.IMAGE && media?.url && (
                <img
                    src={media.url}
                    alt={media?.alt || 'image'}
                />
            )}

            {backgroundMediaType === MEDIA_TYPE.VIDEO && media?.url && (
                <video
                    src={media.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            )}

            {backgroundColor?.slug && (
                <div></div>
            )}
        </div>
    );
};
