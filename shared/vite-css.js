const toRem = (px) => {
    if (px === 0) return '0';

    return `${(parseFloat(px) / 16).toFixed(4).replace(/\.?0+$/, '')}rem`;
};

const customClamp = (minSize, maxSize, minBreakpoint = 480, maxBreakpoint = 1024, unit = 'vw') => {
    const slope = (maxSize - minSize) / (maxBreakpoint - minBreakpoint);
    const slopeToUnit = slope * 100;
    const interceptRem = toRem(minSize - slope * minBreakpoint);
    const minSizeRem = toRem(minSize);
    const maxSizeRem = toRem(maxSize);

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
                // `@tailwindcss/vite` is `enforce: 'pre'`, so it bundles and minifies
                // the CSS before this transform runs. Its minifier sees `toRem(...)`
                // and `customClamp(...)` as unknown functions and drops the whitespace
                // that separated them from the next value — `toRem(12) toRem(20)`
                // arrives here as `toRem(12)toRem(20)`, and substituting in place would
                // splice the values into `0.75rem1.25rem`. Restore the separator first.
                code = code.replace(/((?:toRem|customClamp)\([^()]*\))(?=[\w.#-])/g, '$1 ');

                // Replace toRem() function calls
                code = code.replace(/toRem\((\d+)\)/g, (match, px) => toRem(parseInt(px)));

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
