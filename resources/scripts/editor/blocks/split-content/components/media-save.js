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
        <div className="relative w-full h-full">
            {backgroundMediaType === 'image' && media?.url && (
                <img
                    src={media.url}
                    alt={media?.alt || 'image'}
                    className="absolute inset-0 w-full h-auto object-cover md:h-full"
                />
            )}

            {backgroundMediaType === 'video' && media?.url && (
                <video
                    src={media.url}
                    autoPlay
                    loop
                    muted
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
