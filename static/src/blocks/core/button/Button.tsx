import type React from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getShadowProps, getTypographyProps, getCustomStyleClass } from '@lib/block-props';
export interface ButtonProps {
    text?: string;
    url?: string;
    tagName?: 'a' | 'button';
    title?: string;
    customStyle?: 'fill' | 'outline';
    // Colors
    textColor?: string;
    backgroundColor?: string;
    // Typography
    textAlign?: 'left' | 'center' | 'right';
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

/** Static rendering of core/button. */
export const Button = ({
    text = 'Button',
    url,
    tagName = 'a',
    title,
    textAlign,
    customStyle,
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
}: ButtonProps) => {
    const colorProps = getColorProps({ textColor, backgroundColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight });
    const shadowProps = getShadowProps({ shadow });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });

    const isButton = tagName === 'button';

    const wrapperClass = cx('wp-block-button', getCustomStyleClass({ customStyle }), className);

    const innerClass = cx('wp-block-button__link', colorProps.className, borderProps.className, typographyProps.className, textAlign && `has-text-align-${textAlign}`, borderRadius === '0' && 'no-border-radius', fontSize && 'has-custom-font-size', 'wp-element-button');

    const innerStyle = {
        ...borderProps.style,
        ...spacingProps.style,
        ...shadowProps.style,
        ...typographyProps.style,
    };

    const Tag = tagName as React.ElementType;

    const linkProps = isButton ? {} : { href: url };

    return (
        <div
            className={wrapperClass}
            id={id || undefined}>
            <Tag
                {...linkProps}
                title={title}
                className={innerClass}
                style={innerStyle}
                dangerouslySetInnerHTML={{ __html: text ?? '' }}
            />
        </div>
    );
};

export default Button;
