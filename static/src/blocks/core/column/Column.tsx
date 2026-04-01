import type React from 'react';
import { useId } from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getShadowProps, getTypographyProps, buildFlowBlockGapCSS, buildConstrainedLayoutCSS } from '@lib/block-props';
import { resolveSpacing } from '@lib/theme';
export interface ColumnProps {
    // Colors
    textColor?: string;
    backgroundColor?: string;
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
    blockSpacing?: string;
    // Layout / other
    verticalAlignment?: 'top' | 'center' | 'bottom';
    width?: string;
    useContentWidth?: boolean;
    contentWidth?: string;
    justifyContent?: 'left' | 'center' | 'right';
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
    // Children
    children?: React.ReactNode;
}

/** Static rendering of core/column. */
export const Column = ({
    children,
    verticalAlignment,
    width,
    // Constrained inner layout
    useContentWidth,
    contentWidth,
    justifyContent,
    className,
    id,
    // named slugs
    textColor,
    backgroundColor,
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
    // block gap (flow layout)
    blockSpacing,
}: ColumnProps) => {
    const rawId = useId();
    const scopeId = 'col' + rawId.replace(/:/g, '');

    const blockGapValue = resolveSpacing(blockSpacing);

    const colorProps = getColorProps({ textColor, backgroundColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight });
    const shadowProps = getShadowProps({ shadow });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });

    const constrainedCSS = useContentWidth ? buildConstrainedLayoutCSS(scopeId, { type: 'constrained', contentSize: contentWidth, justifyContent }) : null;

    const flowGapCSS = buildFlowBlockGapCSS(scopeId, blockGapValue);

    const scopedCSS = [
        constrainedCSS,
        flowGapCSS,
    ]
        .filter(Boolean)
        .join(' ');

    const layoutClass = constrainedCSS ? 'is-layout-constrained' : 'is-layout-flow';

    const blockClass = cx('wp-block-column', layoutClass, verticalAlignment && `is-vertically-aligned-${verticalAlignment}`, scopedCSS && scopeId, colorProps.className, borderProps.className, typographyProps.className, className);

    let flexBasis;
    if (width && /\d/.test(width)) {
        flexBasis = width;
        if (width.endsWith('%')) {
            const multiplier = 1000000000000;
            flexBasis = Math.round(Number.parseFloat(width) * multiplier) / multiplier + '%';
        }
    }

    const blockStyle = {
        ...(flexBasis && { flexBasis }),
        ...borderProps.style,
        ...spacingProps.style,
        ...shadowProps.style,
        ...typographyProps.style,
    };

    return (
        <>
            {scopedCSS && <style>{scopedCSS}</style>}
            <div
                className={blockClass}
                style={blockStyle}
                id={id || undefined}>
                {children}
            </div>
        </>
    );
};

export default Column;
