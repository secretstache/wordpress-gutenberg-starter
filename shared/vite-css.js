const rem = (px) => {
    if (px === 0) return '0';

    return `${(parseFloat(px) / 16).toFixed(4).replace(/\.?0+$/, '')}rem `;
};

const customClamp = (minSize, maxSize, minBreakpoint = 480, maxBreakpoint = 1024, unit = 'vw') => {
    const slope = (maxSize - minSize) / (maxBreakpoint - minBreakpoint);
    const slopeToUnit = slope * 100;
    const interceptRem = rem(minSize - slope * minBreakpoint);
    const minSizeRem = rem(minSize);
    const maxSizeRem = rem(maxSize);

    return `clamp(${minSizeRem}, ${slopeToUnit}${unit} + ${interceptRem}, ${maxSizeRem})`;
};

export function processCSSFunctions() {
    return {
        name: 'process-css-functions',
        transform(code, id) {
            // During yarn dev, Vite serves styles as virtual modules whose ids look like app.css?direct/?inline
            const normalizedId = id.split('?')[0];

            if (normalizedId.endsWith('.css')) {
                // Replace rem() function calls
                code = code.replace(/rem\((\d+)\)/g, (match, px) => rem(parseInt(px)));

                // Replace customClamp() function calls
                code = code.replace(/customClamp\((\d+),\s*(\d+)(?:,\s*(\d+))?(?:,\s*(\d+))?(?:,\s*['"]?(\w+)['"]?)?\)/g, (match, min, max, minBp, maxBp, unit) => {
                    return customClamp(parseInt(min), parseInt(max), minBp ? parseInt(minBp) : 480, maxBp ? parseInt(maxBp) : 1024, unit || 'vw');
                });

                return { code };
            }
        },
    };
}
