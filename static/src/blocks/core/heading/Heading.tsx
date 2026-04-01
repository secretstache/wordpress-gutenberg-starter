import type React from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getTypographyProps, getAlignClass } from '@lib/block-props';
export interface HeadingProps {
    // Content
    content?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
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

/** Static rendering of core/heading. */
export const Heading = ({
    content = 'Heading',
    level = 2,
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
}: HeadingProps) => {
    const Tag = `h${level}` as React.ElementType;

    const colorProps = getColorProps({ textColor, backgroundColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });

    const headingClass = cx('wp-block-heading', getAlignClass({ align }), colorProps.className, borderProps.className, typographyProps.className, textAlign && `has-text-align-${textAlign}`, fontSize && 'has-custom-font-size', className);

    const headingStyle = {
        ...borderProps.style,
        ...spacingProps.style,
        ...typographyProps.style,
    };

    return (
        <Tag
            className={headingClass}
            style={headingStyle}
            id={id || undefined}
            dangerouslySetInnerHTML={{ __html: content ?? '' }}
        />
    );
};

export default Heading;
