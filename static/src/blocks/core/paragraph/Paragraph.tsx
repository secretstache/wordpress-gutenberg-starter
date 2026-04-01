import type React from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getTypographyProps, getAlignClass } from '@lib/block-props';
export interface ParagraphProps {
    // Content
    children?: React.ReactNode;
    dropCap?: boolean;
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
    textAlign?: 'left' | 'center' | 'right';
    // Spacing
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    marginTop?: string;
    marginBottom?: string;
    // Layout / other
    align?: 'left' | 'center' | 'right' | 'wide' | 'full';
    // Border
    borderColor?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderStyle?: string;
    // Block
    className?: string;
    id?: string;
}

/** Static rendering of core/paragraph. */
export const Paragraph = ({
    children,
    dropCap = false,
    textAlign,
    align,
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
}: ParagraphProps) => {
    const colorProps = getColorProps({ textColor, backgroundColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });

    // Drop cap is suppressed when text is centered or right-aligned (matches WP logic)
    const hasDropCap = textAlign === 'center' || textAlign === 'right' ? false : dropCap;

    const paragraphClass = cx(getAlignClass({ align }), colorProps.className, borderProps.className, typographyProps.className, textAlign && `has-text-align-${textAlign}`, hasDropCap && 'has-drop-cap', fontSize && 'has-custom-font-size', className);

    const paragraphStyle = {
        ...borderProps.style,
        ...spacingProps.style,
        ...typographyProps.style,
    };

    return (
        <p
            className={paragraphClass}
            style={paragraphStyle}
            id={id || undefined}>
            {children}
        </p>
    );
};

export default Paragraph;
