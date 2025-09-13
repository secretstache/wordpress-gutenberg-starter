import classNames from 'classnames';

export const MediaSave = ({
    media,
    backgroundMediaType,
    backgroundColor,
    mediaPosition,
}) => {
    if (!media?.url) {
        return null;
    }

    return (
        <div className="">
            {backgroundMediaType === 'image' && media?.url && (
                <img
                    src={media.url}
                    alt={media?.alt || 'image'}
                />
            )}

            {backgroundMediaType === 'video' && media?.url && (
                <video
                    src={media.url}
                    autoPlay
                    loop
                    muted
                />
            )}

            {backgroundColor?.slug && (
                <div></div>
            )}
        </div>
    );
};
