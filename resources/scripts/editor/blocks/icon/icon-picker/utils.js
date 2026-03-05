export const getMaskStyle = (url) => {
    if (!url) return {};

    const maskUrl = `url(${url})`;

    return {
        display: 'block',
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--icon-color)',
        maskMode: 'alpha',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        WebkitMaskImage: maskUrl,
        maskImage: maskUrl,
    };
};
