import { cx, getSpacingProps, getAlignClass, getCustomStyleClass, styleOrUndefined } from '@lib/block-props';
import { url } from '@lib/url';

export interface VideoTrack {
    id?: string;
    src?: string;
    kind?: string;
    label?: string;
    srcLang?: string;
}

export interface VideoProps {
    // Content
    src?: string;
    poster?: string;
    controls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    playsInline?: boolean;
    preload?: 'metadata' | 'auto' | 'none';
    tracks?: VideoTrack[];
    caption?: string;
    // Spacing
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    // Layout / other
    align?: 'left' | 'center' | 'right' | 'wide' | 'full';
    // Block
    customStyle?: string;
    className?: string;
    id?: string;
}

/** Static rendering of core/video. */
export const Video = ({
    src,
    poster,
    controls = true,
    autoplay,
    loop,
    muted,
    playsInline,
    preload = 'metadata',
    tracks = [],
    caption,
    align,
    customStyle,
    className,
    id,
    // spacing
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
}: VideoProps) => {
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom, marginLeft, marginRight });

    const figureClass = cx('wp-block-video', getAlignClass({ align }), getCustomStyleClass({ customStyle }), className);

    return (
        <figure
            className={figureClass}
            style={styleOrUndefined(spacingProps.style)}
            id={id || undefined}>
            {src && (
                <video
                    src={url(src)}
                    poster={poster || undefined}
                    controls={controls || undefined}
                    autoPlay={autoplay || undefined}
                    loop={loop || undefined}
                    muted={muted || undefined}
                    playsInline={playsInline || undefined}
                    preload={preload !== 'metadata' ? preload : undefined}>
                    {tracks.map((track) => {
                        const { id: trackId, ...trackAttrs } = track;

                        return (
                            <track
                                key={trackId ?? trackAttrs.src}
                                {...trackAttrs}
                            />
                        );
                    })}
                </video>
            )}
            {caption && <figcaption className="wp-element-caption">{caption}</figcaption>}
        </figure>
    );
};

export default Video;
