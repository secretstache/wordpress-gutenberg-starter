export * from './unset-blocks.js';
export * from './set-blocks-styles.js';
export * from './set-blocks-variations.js';

export const isSomeColorDark = (colors) => {
    const darkColors = [
        'black',
    ];

    return colors?.some((color) => darkColors.includes(color));
};
