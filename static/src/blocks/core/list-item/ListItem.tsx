import type React from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getTypographyProps } from '@lib/block-props';
export interface ListItemProps {
    // Content
    content?: string;
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

/** Static rendering of core/list-item. */
export const ListItem = ({
    content = '',
    children,
    id,
    className,
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
}: ListItemProps) => {
    const colorProps = getColorProps({ textColor, backgroundColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom, marginLeft, marginRight });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });

    const cls = cx(colorProps.className, borderProps.className, typographyProps.className, className);

    const inlineStyle = {
        ...borderProps.style,
        ...spacingProps.style,
        ...typographyProps.style,
    };

    const styleAttr = Object.keys(inlineStyle).length ? inlineStyle : undefined;

    if (children) {
        return (
            <li
                className={cls}
                style={styleAttr}
                id={id || undefined}>
                <span dangerouslySetInnerHTML={{ __html: content }} />
                {children}
            </li>
        );
    }

    return (
        <li
            className={cls}
            style={styleAttr}
            id={id || undefined}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default ListItem;
