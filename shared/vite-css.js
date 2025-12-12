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

const svgUri = (svg) => {
    let encoded = '';
    const slice = 2000;
    const loops = Math.ceil(svg.length / slice);

    for (let i = 0; i < loops; i++) {
        const start = i * slice;
        const end = start + slice;
        let chunk = svg.slice(start, end);

        // Replace characters in the same order as SCSS
        chunk = chunk.replace(/"/g, "'");
        chunk = chunk.replace(/</g, '%3C');
        chunk = chunk.replace(/>/g, '%3E');
        chunk = chunk.replace(/&/g, '%26');
        chunk = chunk.replace(/#/g, '%23');

        encoded += chunk;
    }

    return `url("data:image/svg+xml;charset=utf8,${encoded}")`;
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

                // Replace svg() function calls
                // Matches svg('...') or svg("...") with the SVG content inside
                code = code.replace(/svgUri\((['"`])([\s\S]*?)\1\)/g, (match, quote, svgContent) => {
                    return svgUri(svgContent);
                });

                return { code };
            }
        },
    };
}
