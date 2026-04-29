import type React from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getTypographyProps, getBlockGapStyle, getAlignClass, getCustomStyleClass } from '@lib/block-props';
export interface ButtonsProps {
    // Colors
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
    blockSpacingHorizontal?: string;
    blockSpacingVertical?: string;
    // Layout / other
    align?: 'wide' | 'full';
    orientation?: 'horizontal' | 'vertical';
    justification?: 'left' | 'center' | 'right' | 'space-between';
    verticalAlignment?: 'top' | 'center' | 'bottom' | 'stretch';
    flexWrap?: 'wrap' | 'nowrap';
    // Border
    borderColor?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderStyle?: string;
    // Block
    customStyle?: string;
    className?: string;
    id?: string;
    // Children
    children?: React.ReactNode;
}

/** Static rendering of core/buttons. */
export const Buttons = ({
    children,
    align,
    customStyle,
    className,
    id,
    // named slugs — no textColor: Buttons block disables text color support
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
    // block gap (horizontal = column gap, vertical = row gap)
    blockSpacingHorizontal,
    blockSpacingVertical,
    // layout (flat)
    orientation,
    justification,
    verticalAlignment,
    flexWrap,
}: ButtonsProps) => {
    const colorProps = getColorProps({ backgroundColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });
    const gapStyle = getBlockGapStyle(undefined, blockSpacingVertical, blockSpacingHorizontal);

    const wrapperClass = cx('wp-block-buttons', 'is-layout-flex', 'wp-block-buttons-is-layout-flex', getAlignClass({ align }), colorProps.className, borderProps.className, typographyProps.className, orientation && `is-${orientation}`, justification && `is-content-justification-${justification}`, verticalAlignment && `is-vertically-aligned-${verticalAlignment}`, flexWrap === 'nowrap' && 'is-nowrap', fontSize && 'has-custom-font-size', getCustomStyleClass({ customStyle }), className);

    const wrapperStyle = {
        ...borderProps.style,
        ...spacingProps.style,
        ...typographyProps.style,
        ...gapStyle,
    };

    return (
        <div
            className={wrapperClass}
            style={wrapperStyle}
            id={id || undefined}>
            {children}
        </div>
    );
};

export default Buttons;
