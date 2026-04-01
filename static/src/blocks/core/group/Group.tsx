import type React from 'react';
import { useId } from 'react';
import { cx, getColorProps, getBorderProps, getSpacingProps, getShadowProps, getTypographyProps, getBlockGapStyle, getAlignClass, styleOrUndefined, buildConstrainedLayoutCSS, type ConstrainedLayout } from '@lib/block-props';
import { resolveSpacing } from '@lib/theme';
// Mirrors CSS value maps from @wordpress/block-editor/src/layouts/flex.js
const justifyContentMap: Record<string, string> = { 'left': 'flex-start', 'right': 'flex-end', 'center': 'center', 'space-between': 'space-between' };
const alignItemsMap: Record<string, string> = { left: 'flex-start', right: 'flex-end', center: 'center', stretch: 'stretch' };
const verticalAlignMap: Record<string, string> = { 'top': 'flex-start', 'center': 'center', 'bottom': 'flex-end', 'stretch': 'stretch', 'space-between': 'space-between' };

interface BuildLayoutOptions {
    useContentWidth?: boolean;
    contentWidth?: string;
    justifyContent?: string;
    verticalAlignment?: string;
    flexWrap?: string;
    columnCount?: number;
    minimumColumnWidth?: string;
    gridItemPosition?: string;
}

function buildLayout(type: string, { useContentWidth, contentWidth, justifyContent, verticalAlignment, flexWrap, columnCount, minimumColumnWidth, gridItemPosition }: BuildLayoutOptions): Record<string, unknown> | undefined {
    if (type === 'group') {
        return {
            type: 'constrained',
            ...(useContentWidth && justifyContent && { justifyContent }),
            ...(useContentWidth && contentWidth && { contentSize: contentWidth }),
        };
    }
    if (type === 'row') {
        return {
            type: 'flex',
            orientation: 'horizontal',
            ...(justifyContent && { justifyContent }),
            ...(verticalAlignment && { verticalAlignment }),
            ...(flexWrap && { flexWrap }),
        };
    }
    if (type === 'stack') {
        return {
            type: 'flex',
            orientation: 'vertical',
            ...(justifyContent && { justifyContent }),
            ...(verticalAlignment && { verticalAlignment }),
            ...(flexWrap && { flexWrap }),
        };
    }
    if (type === 'grid') {
        return {
            type: 'grid',
            gridItemPosition,
            ...(columnCount && { columnCount }),
            ...(minimumColumnWidth && { minimumColumnWidth }),
        };
    }

    return undefined;
}

function resolveLayoutClasses(layout: Record<string, unknown> | undefined): string | undefined {
    if (!layout?.type) return undefined;
    const { type } = layout;

    if (type === 'flex') {
        const orientation = (layout.orientation as string) ?? 'horizontal';
        const justifyContent = layout.justifyContent as string | undefined;
        const verticalAlignment = layout.verticalAlignment as string | undefined;
        const flexWrap = layout.flexWrap as string | undefined;

        return cx('is-layout-flex', 'wp-block-group-is-layout-flex', orientation === 'vertical' && 'is-vertical', justifyContent && `is-content-justification-${justifyContent}`, verticalAlignment && `is-vertically-aligned-${verticalAlignment}`, flexWrap === 'nowrap' && 'is-nowrap');
    }

    return cx(`is-layout-${type}`, `wp-block-group-is-layout-${type}`);
}

function resolveLayoutStyle(layout: Record<string, unknown> | undefined): React.CSSProperties {
    if (!layout?.type) return {};
    const { type } = layout;

    if (type === 'flex') {
        const orientation = (layout.orientation as string) ?? 'horizontal';
        const justifyContent = layout.justifyContent as string | undefined;
        const verticalAlignment = layout.verticalAlignment as string | undefined;
        const flexWrap = (layout.flexWrap as string) ?? 'wrap';
        const s: React.CSSProperties = {};
        if (flexWrap !== 'wrap') (s as Record<string, string>).flexWrap = flexWrap;
        if (orientation === 'horizontal') {
            if (verticalAlignment) s.alignItems = verticalAlignMap[verticalAlignment];
            if (justifyContent) s.justifyContent = justifyContentMap[justifyContent];
        } else {
            s.flexDirection = 'column';
            if (verticalAlignment) s.justifyContent = verticalAlignMap[verticalAlignment];
            if (justifyContent) s.alignItems = alignItemsMap[justifyContent] ?? 'flex-start';
        }

        return s;
    }

    if (type === 'grid') {
        const columnCount = (layout.columnCount as number) ?? 3;
        const minimumColumnWidth = (layout.minimumColumnWidth as string) ?? '23rem';
        const gridItemPosition = (layout.gridItemPosition as string) ?? 'auto';
        if (gridItemPosition === 'manual') {
            return { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` };
        }

        return {
            gridTemplateColumns: `repeat(auto-fill, minmax(min(${minimumColumnWidth}, 100%), 1fr))`,
            containerType: 'inline-size',
        };
    }

    return {};
}

export interface GroupProps {
    // Content
    tagName?: keyof React.JSX.IntrinsicElements;
    // Colors
    textColor?: string;
    backgroundColor?: string;
    gradient?: string;
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
    blockSpacing?: string;
    // Layout / other
    type?: 'group' | 'row' | 'stack' | 'grid';
    useContentWidth?: boolean;
    contentWidth?: string;
    justifyContent?: string;
    verticalAlignment?: string;
    flexWrap?: 'wrap' | 'nowrap';
    columnCount?: number;
    minimumColumnWidth?: string;
    gridItemPosition?: 'auto' | 'manual';
    align?: 'wide' | 'full';
    backgroundImage?: string;
    minHeight?: string;
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

/** Static rendering of core/group. */
export const Group = ({
    children,
    tagName: Tag = 'div',
    type = 'group',
    // Group (constrained)
    useContentWidth,
    contentWidth,
    // Row / Stack (flex)
    justifyContent,
    verticalAlignment,
    flexWrap,
    // Grid
    columnCount,
    minimumColumnWidth,
    gridItemPosition,
    // Common
    align,
    className,
    id,
    // named slugs
    textColor,
    backgroundColor,
    gradient,
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
    blockSpacing,
    // background
    backgroundImage,
    // dimensions
    minHeight,
}: GroupProps) => {
    const rawId = useId();
    const scopeId = 'gb' + rawId.replace(/:/g, '');

    const layout = buildLayout(type, {
        useContentWidth,
        contentWidth,
        justifyContent,
        verticalAlignment,
        flexWrap,
        columnCount,
        minimumColumnWidth,
        gridItemPosition,
    });

    // For constrained layout, blockGap uses scoped margin-block-start CSS, not `gap`.
    const isConstrained = type === 'group';
    const blockGapValue = isConstrained ? resolveSpacing(blockSpacing) : undefined;

    const colorProps = getColorProps({ textColor, backgroundColor, gradient });
    const borderProps = getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle });
    const spacingProps = getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom });
    const shadowProps = getShadowProps({ shadow });
    const typographyProps = getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight });
    const gapStyle = !isConstrained ? getBlockGapStyle(blockSpacing) : {};

    const constrainedCSS = buildConstrainedLayoutCSS(scopeId, layout as ConstrainedLayout | undefined, blockGapValue);

    const cls = cx('wp-block-group', resolveLayoutClasses(layout), constrainedCSS && scopeId, getAlignClass({ align }), colorProps.className, borderProps.className, typographyProps.className, className);

    const inlineStyle = {
        ...borderProps.style,
        ...spacingProps.style,
        ...shadowProps.style,
        ...typographyProps.style,
        ...resolveLayoutStyle(layout),
        ...gapStyle,
        ...(minHeight && { minHeight }),
        ...(backgroundImage && { backgroundImage: `url('${backgroundImage}')` }),
    };

    return (
        <>
            {constrainedCSS && <style>{constrainedCSS}</style>}
            <Tag
                className={cls}
                style={styleOrUndefined(inlineStyle)}
                id={id || undefined}>
                {children}
            </Tag>
        </>
    );
};

export default Group;
