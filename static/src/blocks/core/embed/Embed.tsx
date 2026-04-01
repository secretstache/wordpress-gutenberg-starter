import { cx, getSpacingProps, getAlignClass, styleOrUndefined } from '@lib/block-props';

// --- Provider detection -----------------------------------------------------

function parseYouTubeId(url: string): string | null {
    const m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);

    return m ? m[1] : null;
}

function parseVimeoId(url: string): string | null {
    const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);

    return m ? m[1] : null;
}

interface EmbedDetected {
    providerNameSlug: string;
    type: string;
    aspectRatio: string;
    iframeSrc: string;
    iframeAllow: string;
    allowFullScreen: boolean;
}

/**
 * Detects YouTube or Vimeo from a URL and returns provider metadata + iframe src.
 * Returns null for unrecognised URLs (falls back to raw-URL output).
 */
function detectEmbed(url: string): EmbedDetected | null {
    const youtubeId = parseYouTubeId(url);
    if (youtubeId) {
        return {
            providerNameSlug: 'youtube',
            type: 'video',
            aspectRatio: '16-9',
            iframeSrc: `https://www.youtube.com/embed/${youtubeId}?feature=oembed`,
            iframeAllow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
            allowFullScreen: true,
        };
    }

    const vimeoId = parseVimeoId(url);
    if (vimeoId) {
        return {
            providerNameSlug: 'vimeo',
            type: 'video',
            aspectRatio: '16-9',
            iframeSrc: `https://player.vimeo.com/video/${vimeoId}?dnt=1&app_id=122963`,
            iframeAllow: 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share',
            allowFullScreen: false,
        };
    }

    return null;
}

// --- Component --------------------------------------------------------------

export interface EmbedProps {
    // Content
    url?: string;
    caption?: string;
    title?: string;
    // Spacing
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    // Layout / other
    align?: 'left' | 'center' | 'right' | 'wide' | 'full';
    // Block
    className?: string;
    id?: string;
}

/**
 * Static rendering of core/embed.
 *
 * For recognised providers (YouTube, Vimeo) renders an iframe directly,
 * matching WP's oEmbed output. For other URLs outputs the raw URL inside
 * .wp-block-embed__wrapper (WP processes it server-side).
 */
export const Embed = ({
    url,
    caption,
    // iframe title (comes from oEmbed response in WP; provide via prop here)
    title,
    align,
    className,
    id,
    // spacing
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
}: EmbedProps) => {
    if (!url) return null;

    const detected = detectEmbed(url);

    const providerNameSlug = detected?.providerNameSlug;
    const type = detected?.type;
    const aspectRatio = detected?.aspectRatio;

    const spacingProps = getSpacingProps({ marginTop, marginBottom, marginLeft, marginRight });

    const figureClass = cx('wp-block-embed', type && `is-type-${type}`, providerNameSlug && `is-provider-${providerNameSlug}`, providerNameSlug && `wp-block-embed-${providerNameSlug}`, aspectRatio && `wp-embed-aspect-${aspectRatio}`, aspectRatio && 'wp-has-aspect-ratio', getAlignClass({ align }), className);

    return (
        <figure
            className={figureClass}
            style={styleOrUndefined(spacingProps.style)}
            id={id || undefined}>
            <div className="wp-block-embed__wrapper">
                {detected ? (
                    <iframe
                        title={title || providerNameSlug || undefined}
                        src={detected.iframeSrc}
                        width="500"
                        height="281"
                        frameBorder="0"
                        allow={detected.iframeAllow}
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen={detected.allowFullScreen || undefined}
                    />
                ) : (
                    `\n${url}\n`
                )}
            </div>
            {caption && <figcaption className="wp-element-caption">{caption}</figcaption>}
        </figure>
    );
};

export default Embed;
