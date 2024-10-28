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
                className="w-full h-full"
            />
        );
    }

    return (
        <div className="relative w-full h-full">
            {backgroundMediaType === MEDIA_TYPE.IMAGE && media?.url && (
                <img
                    src={media.url}
                    alt={media?.alt || 'image'}
                    className="absolute inset-0 w-full h-auto object-cover md:!h-full"
                />
            )}

            {backgroundMediaType === MEDIA_TYPE.VIDEO && media?.url && (
                <video
                    src={media.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-auto object-cover h-auto md:w-full md:h-full"
                />
            )}

            {backgroundColor?.slug && (
                <div
                    className={classNames('absolute inset-y-0 z-10 w-[20%]', {
                        'right-0 bg-gradient-to-l': mediaPosition === 'left',
                        'left-0 bg-gradient-to-r': mediaPosition === 'right',
                        [`from-${backgroundColor?.slug}`]: !!backgroundColor?.slug,
                    })}
                />
            )}
        </div>
    );
};
