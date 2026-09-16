import type React from 'react';
import { useId } from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getShadowProps, getTypographyProps, getAlignClass, getCustomStyleClass, buildFlowBlockGapCSS, buildConstrainedLayoutCSS } from '@lib/block-props';
import { resolveColor, resolveSpacing } from '@lib/theme';
import { url as resolveUrl } from '@lib/url';
// --- Helpers inlined from ./shared.js (avoids WP-specific imports) -----------

function dimRatioToClass(ratio: number | undefined): string | undefined {
    return ratio === 50 || ratio === undefined ? undefined : `has-background-dim-${10 * Math.round(ratio / 10)}`;
}

type ContentPosition = 'top left' | 'top center' | 'top right' | 'center left' | 'center center' | 'center right' | 'bottom left' | 'bottom center' | 'bottom right';

const POSITION_CLASSNAMES: Record<string, string> = {
    'top left': 'is-position-top-left',
    'top center': 'is-position-top-center',
    'top right': 'is-position-top-right',
    'center left': 'is-position-center-left',
    'center center': 'is-position-center-center',
    'center right': 'is-position-center-right',
    'bottom left': 'is-position-bottom-left',
    'bottom center': 'is-position-bottom-center',
    'bottom right': 'is-position-bottom-right',
};

function isContentPositionCenter(pos: string | undefined): boolean {
    return !pos || pos === 'center center' || pos === 'center';
}

function getPositionClassName(pos: string | undefined): string | undefined {
    return isContentPositionCenter(pos) ? undefined : pos ? POSITION_CLASSNAMES[pos] : undefined;
}

// -----------------------------------------------------------------------------

export interface CoverProps {
    // Content
    tagName?: keyof React.JSX.IntrinsicElements;
    url?: string;
    mediaId?: number;
    backgroundType?: 'image' | 'video';
    videoPoster?: string;
    hasParallax?: boolean;
    isRepeated?: boolean;
    overlayColor?: string;
    customOverlayColor?: string;
    dimRatio?: number;
    useContentWidth?: boolean;
    contentWidth?: string;
    contentPosition?: ContentPosition;
    // Colors
    textColor?: string;
    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    textTransform?: string;
    textDecoration?: string;
    letterSpacing?: string;
    lineHeight?: string;
    // Spacing
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    marginTop?: string;
    marginBottom?: string;
    blockSpacing?: string;
    // Layout / other
    align?: 'wide' | 'full';
    minHeight?: string;
    fullHeight?: boolean;
    aspectRatio?: string;
    // Border
    borderColor?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderStyle?: string;
    // Shadow
    shadow?: string;
    // Block
    customStyle?: string;
    className?: string;
    id?: string;
    // Children
    children?: React.ReactNode;
}

/** Static rendering of core/cover. */
export const Cover = ({
    children,
    tagName = 'div',
    id,
    customStyle,
    className,
    align,
    // media
    url,
    mediaId,
    backgroundType = 'image',
    videoPoster,
    hasParallax = false,
    isRepeated = false,
    // overlay
    overlayColor,
    customOverlayColor,
    dimRatio = 100,
    // content
    useContentWidth = false,
    contentWidth,
    contentPosition,
    // height
    minHeight,
    fullHeight = false,
    aspectRatio,
    // block supports
    textColor,
    borderColor,
    fontFamily,
    fontSize,
    // inline border
    borderRadius,
    borderWidth,
    borderStyle,
    // shadow
    shadow,
    // inline typography
    fontWeight,
    fontStyle,
    textTransform,
    textDecoration,
    letterSpacing,
    lineHeight,
    // spacing
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
    // block gap
    blockSpacing,
}: CoverProps) => {
    const rawId = useId();
    const scopeId = 'cov' + rawId.replace(/:/g, '');

    const blockGapValue = resolveSpacing(blockSpacing);

    // Cover does not support block-level background color
    const colorProps = getColorProps({ textColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom });
    const shadowProps = getShadowProps({ shadow });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });

    const isImageBackground = backgroundType === 'image';
    const isVideoBackground = backgroundType === 'video';
    const isImgElement = !(hasParallax || isRepeated);

    const minHeightValue = fullHeight ? '100vh' : aspectRatio ? 'unset' : minHeight || undefined;

    const backgroundImage = url ? `url(${url})` : undefined;

    const blockClass = cx('wp-block-cover', hasParallax && 'has-parallax', isRepeated && 'is-repeated', !isContentPositionCenter(contentPosition) && 'has-custom-content-position', getPositionClassName(contentPosition), getAlignClass({ align }), colorProps.className, borderProps.className, typographyProps.className, getCustomStyleClass({ customStyle }), className);

    const blockStyle = {
        minHeight: minHeightValue || undefined,
        aspectRatio: fullHeight ? 'unset' : aspectRatio || undefined,
        ...borderProps.style,

        ...spacingProps.style,
        ...shadowProps.style,
        ...typographyProps.style,
    };

    const imgClass = cx('wp-block-cover__image-background', mediaId ? `wp-image-${mediaId}` : undefined, hasParallax && 'has-parallax', isRepeated && 'is-repeated');

    const overlayColorClass = overlayColor ? `has-${overlayColor}-background-color` : undefined;

    const overlayClass = cx('wp-block-cover__background', overlayColorClass, dimRatioToClass(dimRatio), dimRatio !== undefined && 'has-background-dim');

    const overlayStyle = {
        backgroundColor: customOverlayColor || (overlayColor ? resolveColor(overlayColor) : undefined),
    };

    const Tag = tagName;

    const flowGapCSS = buildFlowBlockGapCSS(scopeId, blockGapValue);

    const innerScopeId = scopeId + 'i';
    const constrainedCSS = useContentWidth ? buildConstrainedLayoutCSS(innerScopeId, { type: 'constrained', ...(contentWidth && { contentSize: contentWidth }) }) : null;

    return (
        <Tag
            className={blockClass}
            style={blockStyle}
            id={id || undefined}>
            {flowGapCSS && <style>{flowGapCSS}</style>}
            {constrainedCSS && <style>{constrainedCSS}</style>}

            {isImageBackground &&
                url &&
                (isImgElement ? (
                    <img
                        className={imgClass}
                        alt=""
                        src={resolveUrl(url)}
                        data-object-fit="cover"
                    />
                ) : (
                    <div
                        className={imgClass}
                        style={{ backgroundImage }}
                    />
                ))}

            {isVideoBackground && url && (
                <video
                    className="wp-block-cover__video-background intrinsic-ignore"
                    autoPlay
                    muted
                    loop
                    playsInline
                    src={url}
                    poster={videoPoster}
                    data-object-fit="cover"
                />
            )}

            <span
                aria-hidden="true"
                className={overlayClass}
                style={overlayStyle}
            />

            <div className={cx('wp-block-cover__inner-container', useContentWidth ? 'is-layout-constrained' : 'is-layout-flow', constrainedCSS && innerScopeId, flowGapCSS && scopeId)}>{children}</div>
        </Tag>
    );
};

export default Cover;
