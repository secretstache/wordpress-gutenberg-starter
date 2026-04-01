import type React from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getTypographyProps, getAlignClass } from '@lib/block-props';
export interface ListProps {
    // Content
    ordered?: boolean;
    type?: string;
    reversed?: boolean;
    start?: number;
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
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
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
    // Children
    children?: React.ReactNode;
}

/** Static rendering of core/list. */
export const List = ({
    children,
    ordered = false,
    type,
    reversed,
    start,
    id,
    className,
    align,
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
    marginLeft,
    marginRight,
}: ListProps) => {
    const Tag = ordered ? 'ol' : 'ul';

    const colorProps = getColorProps({ textColor, backgroundColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom, marginLeft, marginRight });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });

    const cls = cx('wp-block-list', getAlignClass({ align }), colorProps.className, borderProps.className, typographyProps.className, className);

    const inlineStyle = {
        ...(ordered && type && type !== 'decimal' && { listStyleType: type }),
        ...borderProps.style,
        ...spacingProps.style,
        ...typographyProps.style,
    };

    const styleAttr = Object.keys(inlineStyle).length ? inlineStyle : undefined;

    return (
        <Tag
            className={cls}
            style={styleAttr}
            id={id || undefined}
            reversed={reversed || undefined}
            start={start || undefined}>
            {children}
        </Tag>
    );
};

export default List;
