import { useBlockProps } from '@wordpress/block-editor';

import { ICON_TYPES } from './icon-picker/icons.js';

import { getIconData, getSizes, ICON_BG_DEFAULT, ICON_COLOR_DEFAULT } from './utils.js';

export const save = ({ attributes }) => {
    const {
        iconName = '',
        iconType,
        align = 'left',
        iconColor,
        iconBgColor,
        iconSize = 24,
    } = attributes;

    const icon = getIconData(iconType, iconName);

    if (!icon) return null;

    const alignMap = { left: 'justify-start', center: 'justify-center', right: 'justify-end' };

    const blockProps = useBlockProps.save({
        className: `flex ${alignMap[align] || 'justify-start'}`,
    });

    const sizes = getSizes(iconSize);

    const tileStyle = {
        '--icon-bg': iconBgColor?.value || ICON_BG_DEFAULT,
        '--icon-color': iconColor?.value || ICON_COLOR_DEFAULT,
        'width': `${sizes.containerPx}px`,
        'height': `${sizes.containerPx}px`,
        'minWidth': `${sizes.containerPx}px`,
    };

    const iconGlyph = icon.type === ICON_TYPES.CUSTOM ? (
        <div
            className="mask-contain mask-no-repeat bg-[var(--icon-color)]"
            style={{
                width: `${sizes.iconPx}px`,
                height: `${sizes.iconPx}px`,
                WebkitMaskImage: `url(${icon.url})`,
                maskImage: `url(${icon.url})`,
            }}
        />
    ) : (
        <span
            className={icon.className || ''}
            style={{ fontSize: `${sizes.iconPx}px`, lineHeight: 1, display: 'inline-block', color: 'var(--icon-color)' }}
            aria-hidden="true"
        />
    );

    return (
        <div {...blockProps}>
            <div
                className="rounded-lg flex items-center justify-center border border-mist bg-[var(--icon-bg)]"
                style={tileStyle}
            >
                {iconGlyph}
            </div>
        </div>
    );
};
