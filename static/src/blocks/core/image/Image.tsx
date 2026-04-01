import { cx, getBorderProps, getShadowProps, getSpacingProps, getAlignClass } from '@lib/block-props';
import { url as resolveUrl } from '@lib/url';
export interface ImageProps {
    // Content
    url?: string;
    alt?: string;
    caption?: string;
    title?: string;
    href?: string;
    linkTarget?: string;
    // Spacing
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    // Layout / other
    align?: 'left' | 'center' | 'right' | 'wide' | 'full';
    width?: string;
    height?: string;
    aspectRatio?: string;
    scale?: 'cover' | 'contain';
    // Border
    borderColor?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderStyle?: string;
    // Shadow
    shadow?: string;
    // Block
    className?: string;
    id?: string;
}

/** Static rendering of core/image. */
export const Image = ({
    // content
    url,
    alt = '',
    caption,
    title,
    // link
    href,
    linkTarget,
    // dimensions
    width,
    height,
    aspectRatio,
    scale,
    // block
    align,
    className,
    id,
    // border + shadow apply to <img>, margin to <figure>
    borderColor,
    borderRadius,
    borderWidth,
    borderStyle,
    shadow,
    // spacing (margin only for image)
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
}: ImageProps) => {
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const shadowProps = getShadowProps({ shadow });
    const spacingProps = getSpacingProps({ marginTop, marginBottom, marginLeft, marginRight });

    const hasBorder = !!(borderProps.className || (borderProps.style && Object.keys(borderProps.style).length > 0));

    const figureClass = cx('wp-block-image', getAlignClass({ align }), (width || height) && 'is-resized', hasBorder && 'has-custom-border', className);

    const figureStyle = { ...spacingProps.style };

    const imageClass = cx(borderProps.className) || undefined;

    const resolvedAspectRatio = aspectRatio === 'auto' ? undefined : aspectRatio;

    const imageStyle = {
        ...borderProps.style,
        ...shadowProps.style,
        ...(resolvedAspectRatio && { aspectRatio: resolvedAspectRatio }),
        ...(scale && { objectFit: scale }),
        ...(width && { width }),
        ...(height && { height }),
    };

    const img = (
        <img
            src={resolveUrl(url)}
            alt={alt}
            className={imageClass}
            style={Object.keys(imageStyle).length ? imageStyle : undefined}
            title={title || undefined}
        />
    );

    return (
        <figure
            className={figureClass}
            style={Object.keys(figureStyle).length ? figureStyle : undefined}
            id={id || undefined}>
            {href ? (
                <a
                    href={href}
                    target={linkTarget || undefined}>
                    {img}
                </a>
            ) : (
                img
            )}

            {caption && <figcaption className="wp-element-caption">{caption}</figcaption>}
        </figure>
    );
};

export default Image;
