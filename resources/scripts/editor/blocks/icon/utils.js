import { ICON_TYPES, getIconEntry } from './icon-picker/icons.js';

export const ICON_BG_DEFAULT = 'var(--color-black)';
export const ICON_COLOR_DEFAULT = 'var(--color-white)';

export const getSizes = (iconSize = 24) => ({
    iconPx: iconSize,
    containerPx: iconSize * 2,
});

export const getIconData = (iconType, iconName) => {
    const resolvedType = iconType === ICON_TYPES.CUSTOM ? ICON_TYPES.CUSTOM : ICON_TYPES.FONT;

    return getIconEntry(resolvedType, iconName);
};
