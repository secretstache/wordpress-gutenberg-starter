/**
 * Mirrors the get*ClassesAndStyles helpers from @wordpress/block-editor,
 * simplified for static rendering. Each function accepts flat props
 * (no nested WP style object) and returns { className, style } so
 * block components produce identical markup to what WordPress saves.
 *
 * References:
 *   @wordpress/block-editor/src/hooks/use-color-props.js
 *   @wordpress/block-editor/src/hooks/use-border-props.js
 *   @wordpress/block-editor/src/hooks/use-spacing-props.js
 *   @wordpress/block-editor/src/hooks/use-typography-props.js
 *   @wordpress/block-editor/src/hooks/use-shadow-props.js
 */
import type React from 'react';
import { fontSizeMap, fontFamilyMap, resolveSpacing } from './theme';
import { wpSlug } from './wp-global-styles';
import { darkBackground } from '@shared/backgrounds.js';

// --- internal helpers -------------------------------------------------------

/** Mirrors getColorClassName(): 'has-{slug}-{context}' */
function colorCls(context: string, slug: string | undefined): string {
    if (!slug) return '';

    return `has-${slug}-${context}`;
}

/** Mirrors __experimentalGetGradientClass(): 'has-{slug}-gradient-background' */
function gradientCls(slug: string | undefined): string {
    if (!slug) return '';

    return `has-${slug}-gradient-background`;
}

/** Mirrors getFontSizeClass(): 'has-{slug}-font-size' */
function fontSizeCls(slug: string | undefined): string {
    if (!slug) return '';

    return `has-${slug}-font-size`;
}

/** Join truthy strings — drop-in for clsx without the dependency. */
export function cx(...parts: (string | undefined | null | false)[]): string | undefined {
    return parts.flat().filter(Boolean).join(' ') || undefined;
}

// --- Color ------------------------------------------------------------------

export interface ColorPropsInput {
    textColor?: string;
    backgroundColor?: string;
    gradient?: string;
}

/**
 * Mirrors getColorClassesAndStyles().
 *
 * Reads: textColor, backgroundColor, gradient (all preset slugs)
 */
export function getColorProps({ textColor, backgroundColor, gradient }: ColorPropsInput = {}): { className: string | undefined } {
    const bgCls = colorCls('background-color', backgroundColor);
    const textClsVal = colorCls('color', textColor);
    const gradCls = gradientCls(gradient);
    const hasGradient = !!gradCls;
    const isDark = backgroundColor && darkBackground.includes(backgroundColor);

    const className = cx(textClsVal, gradCls, !hasGradient && bgCls, textColor && 'has-text-color', (backgroundColor || gradient) && 'has-background', isDark && 'bg-dark');

    return { className };
}

// --- Border -----------------------------------------------------------------

export interface BorderPropsInput {
    borderColor?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderStyle?: string;
}

/**
 * Mirrors getBorderClassesAndStyles().
 *
 * Reads: borderColor (slug), borderRadius, borderWidth, borderStyle
 */
export function getBorderProps({ borderColor, borderRadius, borderWidth, borderStyle }: BorderPropsInput = {}): { className: string | undefined; style: React.CSSProperties } {
    const className = cx(borderColor && 'has-border-color', colorCls('border-color', borderColor));

    const inlineStyle: React.CSSProperties = {
        ...(borderWidth && { borderWidth }),
        ...(borderStyle && { borderStyle }),
        ...(borderRadius !== undefined && { borderRadius }),
    };

    return { className, style: inlineStyle };
}

// --- Spacing ----------------------------------------------------------------

export interface SpacingPropsInput {
    paddingTop?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    paddingRight?: string;
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
}

/**
 * Mirrors getSpacingClassesAndStyles() — no classes, only inline styles.
 *
 * Reads flat spacing props; each value may be a theme.json spacing slug
 * (resolved via resolveSpacing) or a raw CSS value.
 */
export function getSpacingProps({ paddingTop, paddingBottom, paddingLeft, paddingRight, marginTop, marginBottom, marginLeft, marginRight }: SpacingPropsInput = {}): { style: React.CSSProperties } {
    const s: React.CSSProperties = {};

    if (paddingTop) s.paddingTop = resolveSpacing(paddingTop);
    if (paddingBottom) s.paddingBottom = resolveSpacing(paddingBottom);
    if (paddingLeft) s.paddingLeft = resolveSpacing(paddingLeft);
    if (paddingRight) s.paddingRight = resolveSpacing(paddingRight);
    if (marginTop) s.marginTop = resolveSpacing(marginTop);
    if (marginBottom) s.marginBottom = resolveSpacing(marginBottom);
    if (marginLeft) s.marginLeft = resolveSpacing(marginLeft);
    if (marginRight) s.marginRight = resolveSpacing(marginRight);

    return { style: s };
}

// --- Block gap --------------------------------------------------------------

/**
 * Returns inline gap styles for flex/grid layout blocks.
 * Pass blockSpacing for a uniform gap, or blockSpacingRow + blockSpacingColumn
 * for independent row/column gaps.
 */
export function getBlockGapStyle(blockSpacing?: string, blockSpacingRow?: string, blockSpacingColumn?: string): React.CSSProperties {
    const rowGap = resolveSpacing(blockSpacingRow);
    const colGap = resolveSpacing(blockSpacingColumn);
    if (rowGap || colGap) {
        return { rowGap: rowGap ?? colGap, columnGap: colGap ?? rowGap };
    }
    const gap = resolveSpacing(blockSpacing);

    return gap ? { gap } : {};
}

// --- Shadow -----------------------------------------------------------------

export interface ShadowPropsInput {
    shadow?: string;
}

/**
 * Mirrors getShadowClassesAndStyles() — no classes, only box-shadow.
 *
 * Reads: shadow (CSS box-shadow string)
 */
export function getShadowProps({ shadow }: ShadowPropsInput = {}): { style: React.CSSProperties } {
    return { style: shadow ? { boxShadow: shadow } : {} };
}

// --- Typography -------------------------------------------------------------

export interface TypographyPropsInput {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    fontStyle?: string;
    textTransform?: string;
    textDecoration?: string;
    letterSpacing?: string;
    lineHeight?: string;
}

/**
 * Mirrors getTypographyClassesAndStyles().
 *
 * Reads: fontFamily, fontSize (preset slugs),
 *        fontWeight, fontStyle, letterSpacing, lineHeight,
 *        textDecoration, textTransform (inline values)
 */
export function getTypographyProps({ fontFamily, fontSize, fontWeight, fontStyle, textTransform, textDecoration, letterSpacing, lineHeight }: TypographyPropsInput = {}): { className: string | undefined; style: React.CSSProperties } {
    const className = cx(fontFamily && `has-${fontFamily.toLowerCase().replace(/\s+/g, '-')}-font-family`, fontSizeCls(fontSize));

    const resolvedFontSize = fontSize ? (fontSizeMap.has(fontSize) ? `var(--wp--preset--font-size--${wpSlug(fontSize)})` : fontSize) : undefined;
    const resolvedFontFamily = fontFamily ? (fontFamilyMap.has(fontFamily) ? `var(--wp--preset--font-family--${fontFamily})` : fontFamily) : undefined;

    const inlineStyle: React.CSSProperties = {
        ...(resolvedFontSize && { fontSize: resolvedFontSize }),
        ...(resolvedFontFamily && { fontFamily: resolvedFontFamily }),
        ...(fontWeight && { fontWeight }),
        ...(fontStyle && { fontStyle }),
        ...(letterSpacing && { letterSpacing }),
        ...(lineHeight && { lineHeight }),
        ...(textDecoration && { textDecoration }),
        ...(textTransform && { textTransform }),
    };

    return { className, style: inlineStyle };
}

// --- Block style (variation) ------------------------------------------------

/**
 * Returns the is-style-* class for a block style variation.
 * e.g. getCustomStyleClass({ customStyle: 'outline' }) → 'is-style-outline'
 */
export function getCustomStyleClass({ customStyle }: { customStyle?: string } = {}): string | undefined {
    return customStyle ? `is-style-${customStyle}` : undefined;
}

// --- Alignment --------------------------------------------------------------

/**
 * Returns the alignment class for blocks that declare align support.
 * e.g. getAlignClass({ align: 'wide' }) → 'alignwide'
 */
export function getAlignClass({ align }: { align?: string } = {}): string | undefined {
    return align ? `align${align}` : undefined;
}

// --- Style guard ------------------------------------------------------------

/**
 * Returns the object if it has at least one key, otherwise undefined.
 * Prevents React from rendering an empty style attribute.
 */
export function styleOrUndefined(obj: React.CSSProperties | undefined): React.CSSProperties | undefined {
    return obj && Object.keys(obj).length ? obj : undefined;
}

// --- Flow block gap ---------------------------------------------------------

/**
 * Generates scoped CSS for blockGap in flow/constrained layout blocks.
 * Flow and constrained layouts use margin-block-start on children (not `gap`).
 */
export function buildFlowBlockGapCSS(scopeClass: string, blockGapValue: string | undefined): string | null {
    if (!blockGapValue) return null;

    return `.${scopeClass} > :first-child { margin-block-start: 0; }` + ` .${scopeClass} > :last-child { margin-block-end: 0; }` + ` .${scopeClass} > * { margin-block-start: ${blockGapValue}; margin-block-end: 0; }`;
}

// --- Constrained layout CSS -------------------------------------------------

export interface ConstrainedLayout {
    type: string;
    contentSize?: string;
    wideSize?: string;
    justifyContent?: string;
}

/**
 * Generates scoped CSS for constrained layout blocks.
 * Mirrors @wordpress/block-editor/src/layouts/constrained.js.
 */
export function buildConstrainedLayoutCSS(scopeClass: string, layout: ConstrainedLayout | undefined, blockGap?: string): string | null {
    if (layout?.type !== 'constrained') return null;
    const { contentSize, wideSize, justifyContent = 'center' } = layout;

    const marginLeft = justifyContent === 'left' ? '0' : 'auto';
    const marginRight = justifyContent === 'right' ? '0' : 'auto';

    let css = '';

    if (contentSize || wideSize) {
        css += `.${scopeClass} > :where(:not(.alignleft):not(.alignright):not(.alignfull)) {` + ` max-width: ${contentSize ?? wideSize};` + ` margin-left: ${marginLeft} !important;` + ` margin-right: ${marginRight} !important; }` + ` .${scopeClass} > .alignwide { max-width: ${wideSize ?? contentSize}; }` + ` .${scopeClass} > .alignfull { max-width: none; }`;
    } else if (justifyContent === 'left') {
        css += `.${scopeClass} > :where(:not(.alignleft):not(.alignright):not(.alignfull)) { margin-left: 0 !important; }`;
    } else if (justifyContent === 'right') {
        css += `.${scopeClass} > :where(:not(.alignleft):not(.alignright):not(.alignfull)) { margin-right: 0 !important; }`;
    }

    if (blockGap) {
        css += ` .${scopeClass} > :first-child { margin-block-start: 0; }` + ` .${scopeClass} > :last-child { margin-block-end: 0; }` + ` .${scopeClass} > * { margin-block-start: ${blockGap}; margin-block-end: 0; }`;
    }

    return css || null;
}

// --- Layout (flex) ----------------------------------------------------------

export interface FlexLayout {
    type?: string;
    orientation?: string;
    justification?: string;
    verticalAlignment?: string;
    flexWrap?: 'wrap' | 'nowrap';
}

/**
 * Returns layout classes for flex-layout blocks (Buttons, Column).
 */
export function getLayoutProps({ layout }: { layout?: FlexLayout } = {}): { className: string | undefined; style: React.CSSProperties } {
    const { type = 'flex', orientation, justification, verticalAlignment, flexWrap } = layout ?? {};

    if (type !== 'flex') return { className: undefined, style: {} };

    const className = cx('is-layout-flex', orientation && `is-${orientation}`, justification && `is-content-justification-${justification}`, verticalAlignment && `is-vertically-aligned-${verticalAlignment}`, flexWrap === 'nowrap' && 'is-nowrap');

    return { className, style: {} };
}
