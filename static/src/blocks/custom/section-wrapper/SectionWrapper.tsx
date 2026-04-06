import type React from 'react';
import { cx } from '@lib/block-props';
import { darkBackground } from '@shared/backgrounds.js';
import { url } from '@lib/url';

export interface SectionWrapperSpacingMobile {
    mt?: number;
    mb?: number;
    pt?: number;
    pb?: number;
}

export interface SectionWrapperSpacing {
    mt?: number;
    mb?: number;
    pt?: number;
    pb?: number;
    mobile?: SectionWrapperSpacingMobile;
}

export interface SectionWrapperBgMedia {
    image?: string;
    video?: string;
    position?: string;
    fit?: string;
}

export interface SectionWrapperOverlay {
    from?: string;
    fromOpacity?: number;
    to?: string;
    toOpacity?: number;
}

export interface SectionWrapperBg {
    color?: string;
    media?: SectionWrapperBgMedia;
    overlay?: SectionWrapperOverlay;
}

export interface SectionWrapperProps {
    // Content
    fullHeight?: boolean;
    spacing?: SectionWrapperSpacing;
    bg?: SectionWrapperBg;
    // Block
    className?: string;
    id?: string;
    // Children
    children?: React.ReactNode;
}

export const SectionWrapper = ({ children, className, id, fullHeight = false, spacing = {}, bg = {} }: SectionWrapperProps) => {
    const { mt, mb, pt, pb, mobile = {} } = spacing;
    const { mt: mmt, mb: mmb, pt: mpt, pb: mpb } = mobile;

    const { color: bgColor, media: bgMedia, overlay = {} } = bg;

    const hasBackground = !!(bgColor || bgMedia);
    const hasBgMedia = !!bgMedia;
    const isDarkBg = hasBgMedia || (bgColor ? darkBackground.includes(bgColor) : false);

    // ── Wrapper ──────────────────────────────────────────────────────────────
    const wrapperClass = cx('wp-block-ssm-section-wrapper', 'group/sectionWrapper', 'flex relative w-full', mt !== undefined && `md:mt-ssm-${mt}`, mb !== undefined && `md:mb-ssm-${mb}`, pt !== undefined && `md:pt-ssm-${pt}`, pb !== undefined && `md:pb-ssm-${pb}`, mmt !== undefined && `max-md:mt-ssm-${mmt}`, mmb !== undefined && `max-md:mb-ssm-${mmb}`, mpt !== undefined && `max-md:pt-ssm-${mpt}`, mpb !== undefined && `max-md:pb-ssm-${mpb}`, isDarkBg && 'bg-dark', hasBackground && 'has-background', fullHeight && 'min-h-screen', className);

    // ── Background div ────────────────────────────────────────────────────────
    const backgroundClass = cx('wp-block-ssm-section-wrapper__background', 'absolute pointer-events-none h-full w-full left-0 top-0 overflow-hidden', bgColor && `bg-${bgColor}`);

    // ── Media element ─────────────────────────────────────────────────────────
    const objectFit = bgMedia?.fit ? `object-${bgMedia.fit}` : bgMedia?.position ? 'object-contain' : 'object-cover h-full';
    const mediaClass = cx('w-full', objectFit, bgMedia?.position && `object-${bgMedia.position}`);

    // ── Overlay ───────────────────────────────────────────────────────────────
    const overlayFrom = overlay.from ?? 'charcoal';
    const overlayFromOpacity = overlay.fromOpacity ?? (bgColor ? 0 : 100);
    const overlayTo = overlay.to ?? 'charcoal';
    const overlayToOpacity = overlay.toOpacity ?? 0;

    const overlayStyle = {
        '--gradient-from': `color-mix(in oklab, var(--color-${overlayFrom}) ${overlayFromOpacity}%, transparent)`,
        '--gradient-to': `color-mix(in oklab, var(--color-${overlayTo}) ${overlayToOpacity}%, transparent)`,
    } as React.CSSProperties;

    return (
        <section
            className={wrapperClass}
            id={id}>
            {hasBackground && (
                <div className={backgroundClass}>
                    {bgMedia?.image && (
                        <img
                            alt=""
                            src={url(bgMedia.image)}
                            className={mediaClass}
                        />
                    )}

                    {bgMedia?.video && (
                        <video
                            src={url(bgMedia.video)}
                            autoPlay
                            playsInline
                            muted
                            loop
                            className={mediaClass}
                        />
                    )}

                    <div
                        className="wp-block-ssm-section-wrapper__overlay absolute inset-0 gradient-to-r z-10"
                        style={overlayStyle}
                    />
                </div>
            )}

            <div className="wp-block-ssm-section-wrapper__content px-container-padding relative z-20 w-full is-layout-constrained">{children}</div>
        </section>
    );
};

export default SectionWrapper;
