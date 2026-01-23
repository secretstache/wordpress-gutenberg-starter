export const DARK_COLORS = [
    'black',
];

export const isSomeColorDark = (colorsToCheck, darkColors = DARK_COLORS) => {
    return colorsToCheck?.some((color) => darkColors.includes(color));
};
