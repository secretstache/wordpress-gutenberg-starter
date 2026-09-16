import type React from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getShadowProps, getTypographyProps, getBlockGapStyle, getAlignClass, getCustomStyleClass } from '@lib/block-props';
export interface ColumnsProps {
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
    blockSpacingRow?: string;
    blockSpacingColumn?: string;
    // Layout / other
    verticalAlignment?: 'top' | 'center' | 'bottom';
    isStackedOnMobile?: boolean;
    align?: 'wide' | 'full';
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

/** Static rendering of core/columns. */
export const Columns = ({
    children,
    verticalAlignment,
    isStackedOnMobile = true,
    align,
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
    marginTop,
    marginBottom,
    // block gap
    blockSpacingRow,
    blockSpacingColumn,
}: ColumnsProps) => {
    const colorProps = getColorProps({ textColor, backgroundColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom });
    const shadowProps = getShadowProps({ shadow });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });
    const gapStyle = getBlockGapStyle(undefined, blockSpacingRow, blockSpacingColumn);

    const blockClass = cx('wp-block-columns', 'is-layout-flex', verticalAlignment && `are-vertically-aligned-${verticalAlignment}`, !isStackedOnMobile && 'is-not-stacked-on-mobile', getAlignClass({ align }), colorProps.className, borderProps.className, typographyProps.className, getCustomStyleClass({ customStyle }), className);

    const blockStyle = {
        ...borderProps.style,

        ...spacingProps.style,
        ...shadowProps.style,
        ...typographyProps.style,
        ...gapStyle,
    };

    return (
        <div
            className={blockClass}
            style={blockStyle}
            id={id || undefined}>
            {children}
        </div>
    );
};

export default Columns;
