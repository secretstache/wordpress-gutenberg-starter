import prettify from 'html-prettify';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';
import { darkBackground } from '../shared/backgrounds.js';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = {
    input: path.resolve(__dirname, 'src/pages'),
    output: path.resolve(__dirname, 'dist'),
    includes: '../partials',
    layouts: '../layouts',
    data: '../data',
};

const assets = [
    'images',
    'video',
    'fonts',
    'animations',
];

const mode = process.env.mode || 'development';
const isDev = mode === 'development';
const isBlocks = process.env.project === 'blocks';

const root = process.env.prefix;

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight);

    // Disable cache during development
    if (isDev) {
        eleventyConfig.setUseTemplateCache(false);
    }

    // Copy assets to the output folder - also fix these paths
    assets.forEach((asset) => {
        eleventyConfig.addPassthroughCopy({
            [path.resolve(__dirname, `../resources/${asset}`)]: `assets/${asset}`,
        });
    });

    // Enable quiet mode to reduce console noise
    eleventyConfig.setQuietMode(true);

    // Use yaml for data files
    eleventyConfig.addDataExtension('yml, yaml', (contents) => yaml.load(contents));

    /* Design system commands */

    eleventyConfig.addPairedShortcode('prettify', (content) => {
        return prettify(content, { count: 4 });
    });

    eleventyConfig.addFilter('console', function (value) {
        return JSON.stringify(value, null, 2);
    });

    eleventyConfig.addShortcode('rawCodeSnippet', async function (fileUrl) {
        let result = await fs.readFile(path.resolve(__dirname, './src/partials/' + fileUrl), { encoding: 'utf-8' });

        return `${result}`;
    });

    eleventyConfig.addPairedShortcode('brace', function (content, type = 'curly') {
        const [
            opening,
            closing,
        ] = {
            curly: [
                '{{',
                '}}',
            ],
            call: [
                '{%',
                '%}',
            ],
            silent: [
                '{%-',
                '-%}',
            ],
        }[type];

        return `${opening}${content}${closing}`;
    });

    eleventyConfig.addFilter('toRem', function (value) {
        return parseInt(value) / 16 + 'rem';
    });

    eleventyConfig.addFilter('split', function (value, delimiter = '') {
        if (value === undefined || value === null) {
            return [];
        }

        return String(value).split(delimiter);
    });

    /* Adds prefix to urls */
    eleventyConfig.addGlobalData('root', process.env.prefix);
    eleventyConfig.addNunjucksGlobal('root', process.env.prefix || '');

    eleventyConfig.addFilter('toBgType', function (color) {
        if (darkBackground.includes(color)) {
            return 'bg-dark';
        } else if (color) {
            return 'bg-light';
        }

        return '';
    });

    /* Server options */
    eleventyConfig.setServerOptions({
        watch: [
            'dist/assets/scripts/**/*.*',
            'dist/assets/styles/**/*.*',
        ],
        liveReload: true,
        domDiff: true,
    });

    eleventyConfig.addWatchTarget('./src/**/*');

    /* Unique id */
    eleventyConfig.addNunjucksGlobal('uid', () => {
        return `${Date.now() + Math.floor(Math.random() * 1000)}`;
    });

    eleventyConfig.addNunjucksGlobal('buildClasses', function (props = {}, baseClasses = []) {
        // Standard mappings that are the same everywhere
        const standardMappings = {
            color: props.color ? `has-${props.color}-color` : null,
            background: props.background ? `has-${props.background}-background-color` : null,
            gradient: props.gradient ? `has-${props.gradient}-gradient-background` : null,
            fontSize: props.fontSize ? `has-${props.fontSize}-font-size` : null,
            fontFamily: props.fontFamily ? `has-${props.fontFamily}-font-family` : null,
            customStyle: props.customStyle ? `is-style-${props.customStyle}` : null,
            justification: props.justification ? `is-content-justification-${props.justification}` : null,
            stacked: props.stacked ? `is-vertical` : null,
            align: props.align ? `align${props.align}` : null,
            notStackedOnMobile: props.notStackedOnMobile ? `is-not-stacked-on-mobile` : null,
            textAlign: props.textAlign ? `has-text-align-${props.textAlign}` : null,
            verticalAlign: props.verticalAlign ? `are-vertically-aligned-${props.verticalAlign}` : null,
            class: props.class || null,
        };

        // Build class array from all mappings that exist
        const propClasses = Object.values(standardMappings).filter(Boolean);

        if (props.background || props.backgroundImage || props.gradient) {
            propClasses.push('has-background');
        }

        if (props.color) {
            propClasses.push('has-text-color');
        }

        // Auto-add bg-dark or bg-light if background is set
        if (props.background) {
            const bgType = darkBackground.includes(props.background) ? 'bg-dark' : 'bg-light';
            propClasses.push(bgType);
        }

        // Combine base classes with prop classes
        const allClasses = [
            ...baseClasses,
            ...propClasses,
        ]
            .filter(Boolean)
            .join(' ');

        return allClasses ? ' ' + allClasses : '';
    });

    eleventyConfig.addNunjucksGlobal('buildStyles', function (props = {}, baseStyles = []) {
        // Standard style mappings
        const standardMappings = {
            wrapperStyle: props.wrapperStyle || null,
            style: props.style || null,
            rowGap: props.rowGap ? `row-gap:${props.rowGap}` : null,
            columnGap: props.columnGap ? `column-gap:${props.columnGap}` : null,
            minHeight: props.minHeight ? `min-height:${props.minHeight}` : null,
            backgroundImage: props.backgroundImage ? `background-image:url('${root + props.backgroundImage}');background-size:cover` : null,
        };

        // Build style array from all mappings that exist
        const propStyles = Object.values(standardMappings).filter(Boolean);

        // Remove quotes from baseStyles
        const cleanBaseStyles = baseStyles.map((style) => (style ? style.replace(/["']/g, '') : style));

        // Combine base styles with prop styles
        const allStyles = [
            ...cleanBaseStyles,
            ...propStyles,
        ]
            .filter(Boolean)
            .join(';');

        return allStyles ? ` style="${allStyles}"` : '';
    });

    eleventyConfig.addNunjucksGlobal('buildAttributes', function (props = {}, baseAttributes = []) {
        // Standard attribute mappings
        const standardMappings = {
            ariaCurrent: props.ariaCurrent ? `aria-current="${props.ariaCurrent}"` : null,
            ariaExpanded: props.ariaExpanded !== undefined ? `aria-expanded="${props.ariaExpanded}"` : null,
            ariaLabel: props.ariaLabel ? `aria-label="${props.ariaLabel}"` : null,
            ariaHidden: props.ariaHidden !== undefined ? `aria-hidden="${props.ariaHidden}"` : null,
            ariaControls: props.ariaControls ? `aria-controls="${props.ariaControls}"` : null,
            role: props.role ? `role="${props.role}"` : null,
            target: props.target ? `target="${props.target}"` : null,
            rel: props.rel ? `rel="${props.rel}"` : null,
            href: props.href ? `href="${props.href}"` : null,
            id: props.id ? `id="${props.id}"` : null,
            title: props.title ? `title="${props.title}"` : null,
            disabled: props.disabled ? `disabled` : null,
        };

        // Build attribute array from all mappings that exist
        const propAttributes = Object.values(standardMappings).filter(Boolean);

        // Combine base attributes with prop attributes
        const allAttributes = [
            ...baseAttributes,
            ...propAttributes,
        ]
            .filter(Boolean)
            .join(' ');

        return allAttributes ? ' ' + allAttributes : '';
    });

    function sortByTitle(values) {
        return values.slice().sort((a, b) => a.data.title.localeCompare(b.data.title));
    }

    eleventyConfig.addFilter('sortByTitle', sortByTitle);

    eleventyConfig.addShortcode('optionsTree', function (options) {
        if (!options) return;

        function createListFromObject(obj) {
            let html = '';

            if (obj['description']) {
                html += `<p class="ds-options__description">${obj['description']}</p>`;
            }

            html += '<ul class="ds-options">';

            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (Array.isArray(obj[key])) {
                        html += `<li><strong>${key}</strong><ul>`;
                        obj[key].forEach((item) => {
                            html += `<li>${item}</li>`;
                        });
                        html += `</ul></li>`;
                    } else {
                        html += `<li><strong>${key}</strong>${createListFromObject(obj[key])}</li>`;
                    }
                } else {
                    if (key !== 'description') {
                        html += `<li><strong>${key}:</strong> ${obj[key]}</li>`;
                    }
                }
            }

            html += '</ul>';

            return html;
        }

        return createListFromObject(options);
    });

    return {
        dir,
        passthroughFileCopy: true,
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
    };
}
