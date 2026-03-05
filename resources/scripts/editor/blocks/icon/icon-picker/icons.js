export const ICON_TYPES = {
    FONT: 'font',
    CUSTOM: 'custom',
};

const toTitleCase = (value) => value
    .replace(/^icon-/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getIconNameFromPath = (path) => {
    const fileName = path.split('/').pop() || '';

    return fileName.replace(/\.svg$/i, '');
};

// ═══════════════════════════════════════════════════════════════
// ICON LIBRARY CONFIGURATION
// To swap icon library for a new project:
// 1. Replace the import below with your library's icon data JSON
// 2. Update FONT_BASE_CLASS to the new library's base CSS class
// 3. Update @import in app.css, editor-canvas.css, editor-ui.css
// 4. Update the icon data mapping to match the new data format
// ═══════════════════════════════════════════════════════════════

const FONT_BASE_CLASS = 'ssm-lucide-icon';

import fontIconData from '@modules/lucide-static/font/info.json';

const customIconUrls = import.meta.glob(
    '@images/icons/*.svg',
    { eager: true, as: 'url' },
);

const customIcons = Object.entries(customIconUrls)
    .map(([path, url]) => {
        const name = getIconNameFromPath(path);

        return {
            name,
            label: toTitleCase(name),
            type: ICON_TYPES.CUSTOM,
            url,
        };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

const fontIcons = Object.entries(fontIconData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, info]) => ({
        name,
        label: toTitleCase(name),
        type: ICON_TYPES.FONT,
        className: `${FONT_BASE_CLASS} ${info?.className || `icon-${name}`}`,
    }));

export const ICON_SETS = [
    {
        key: ICON_TYPES.CUSTOM,
        label: 'Custom',
        icons: customIcons,
    },
    {
        key: ICON_TYPES.FONT,
        label: 'Font Icons', // rename to match your library
        icons: fontIcons,
    },
];

const iconMap = {
    [ICON_TYPES.CUSTOM]: Object.fromEntries(
        customIcons.map((icon) => [icon.name, icon]),
    ),
    [ICON_TYPES.FONT]: Object.fromEntries(
        fontIcons.map((icon) => [icon.name, icon]),
    ),
};

export const getIconEntry = (iconType, iconName) => {
    if (!iconType || !iconName) return null;

    return iconMap[iconType]?.[iconName] || null;
};

export const filterIconSets = (searchTerm) => {
    const normalizeSets = (sets) => sets.filter((set) => set.icons.length > 0);

    if (!searchTerm) return normalizeSets(ICON_SETS);

    const term = searchTerm.toLowerCase();

    return normalizeSets(ICON_SETS
        .map((set) => ({
            ...set,
            icons: set.icons.filter((icon) => {
                return icon.name.toLowerCase().includes(term)
                    || icon.label.toLowerCase().includes(term);
            }),
        })));
};
