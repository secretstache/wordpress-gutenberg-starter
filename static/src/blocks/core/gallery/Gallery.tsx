import type React from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getBlockGapStyle, getAlignClass, styleOrUndefined } from '@lib/block-props';
export interface GalleryProps {
    // Content
    caption?: string;
    // Colors
    backgroundColor?: string;
    // Spacing
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    blockSpacingRow?: string;
    blockSpacingColumn?: string;
    // Layout / other
    columns?: number;
    imageCrop?: boolean;
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

/** Static rendering of core/gallery. */
export const Gallery = ({
    children,
    columns,
    imageCrop = true,
    caption,
    align,
    id,
    className,
    // block supports — no text color
    backgroundColor,
    borderColor,
    // inline border
    borderRadius,
    borderWidth,
    borderStyle,
    // spacing
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    // block gap
    blockSpacingRow,
    blockSpacingColumn,
}: GalleryProps) => {
    const colorProps = getColorProps({ backgroundColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom, marginLeft, marginRight });
    const gapStyle = getBlockGapStyle(undefined, blockSpacingRow, blockSpacingColumn);

    const cls = cx('wp-block-gallery', 'has-nested-images', columns !== undefined ? `columns-${columns}` : 'columns-default', imageCrop && 'is-cropped', getAlignClass({ align }), colorProps.className, borderProps.className, className);

    const inlineStyle = {
        ...borderProps.style,
        ...spacingProps.style,
        ...gapStyle,
    };

    return (
        <figure
            className={cls}
            style={styleOrUndefined(inlineStyle)}
            id={id || undefined}>
            {children}
            {caption && <figcaption className="blocks-gallery-caption wp-element-caption">{caption}</figcaption>}
        </figure>
    );
};

export default Gallery;
