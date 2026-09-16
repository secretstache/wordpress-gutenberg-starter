import type React from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getTypographyProps, getAlignClass, getCustomStyleClass, styleOrUndefined } from '@lib/block-props';

// ─── Inner components ────────────────────────────────────────────────────────

export interface ThProps {
    content?: string;
    scope?: string;
    align?: string;
    colspan?: number;
    rowspan?: number;
    className?: string;
    children?: React.ReactNode;
}

export const Th = ({ content, scope, align, colspan, rowspan, className, children }: ThProps) => (
    <th
        scope={scope}
        className={cx(align ? `has-text-align-${align}` : undefined, className) || undefined}
        data-align={align || undefined}
        colSpan={colspan}
        rowSpan={rowspan}
        {...(!children && { dangerouslySetInnerHTML: { __html: content ?? '' } })}>
        {children}
    </th>
);

export interface TdProps {
    content?: string;
    align?: string;
    colspan?: number;
    rowspan?: number;
    className?: string;
    children?: React.ReactNode;
}

export const Td = ({ content, align, colspan, rowspan, className, children }: TdProps) => (
    <td
        className={cx(align ? `has-text-align-${align}` : undefined, className) || undefined}
        data-align={align || undefined}
        colSpan={colspan}
        rowSpan={rowspan}
        {...(!children && { dangerouslySetInnerHTML: { __html: content ?? '' } })}>
        {children}
    </td>
);

export const Tr = ({ children }: { children?: React.ReactNode }) => <tr>{children}</tr>;
export const Thead = ({ children }: { children?: React.ReactNode }) => <thead>{children}</thead>;
export const Tbody = ({ children }: { children?: React.ReactNode }) => <tbody>{children}</tbody>;
export const Tfoot = ({ children }: { children?: React.ReactNode }) => <tfoot>{children}</tfoot>;

// ─── Table ───────────────────────────────────────────────────────────────────

export interface TableProps {
    // Content
    caption?: string;
    hasFixedLayout?: boolean;
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
    customStyle?: string;
    className?: string;
    id?: string;
    // Children
    children?: React.ReactNode;
}

/**
 * Static rendering of core/table.
 *
 * Color and border props are applied to the inner <table> element.
 * Spacing and typography props are applied to the outer <figure> wrapper,
 * matching WP's selectors: { root: ".wp-block-table > table", spacing: ".wp-block-table" }.
 *
 * Usage: <Table><Thead><Tr><Th>…</Th></Tr></Thead><Tbody><Tr><Td>…</Td></Tr></Tbody></Table>
 */
export const Table = ({
    caption,
    hasFixedLayout = true,
    // named slugs
    textColor,
    backgroundColor,
    borderColor,
    fontFamily,
    fontSize,
    // inline border (applied to <table>)
    borderRadius,
    borderWidth,
    borderStyle,
    // inline typography (applied to <figure>)
    fontWeight,
    fontStyle,
    textTransform,
    textDecoration,
    letterSpacing,
    lineHeight,
    // spacing (applied to <figure>)
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    align,
    customStyle,
    className,
    id,
    children,
}: TableProps) => {
    const colorProps = getColorProps({ textColor, backgroundColor });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom, marginLeft, marginRight });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });

    const figureClass = cx('wp-block-table', getAlignClass({ align }), typographyProps.className, getCustomStyleClass({ customStyle }), className);

    const figureStyle = {
        ...spacingProps.style,
        ...typographyProps.style,
    };

    const tableClass = cx(hasFixedLayout ? 'has-fixed-layout' : undefined, colorProps.className, borderProps.className);

    const tableStyle = {
        ...borderProps.style,
    };

    return (
        <figure
            className={figureClass}
            style={styleOrUndefined(figureStyle)}
            id={id || undefined}>
            <table
                className={tableClass || undefined}
                style={styleOrUndefined(tableStyle)}>
                {children}
            </table>
            {caption && <figcaption className="wp-element-caption">{caption}</figcaption>}
        </figure>
    );
};

export default Table;
