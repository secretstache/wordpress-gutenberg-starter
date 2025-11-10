import prettify from 'html-prettify';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import fs from 'fs/promises';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

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

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight);

    // Disable cache during development
    if (isDev) {
        eleventyConfig.setUseTemplateCache(false);
    }

    // Copy assets to the output folder - also fix these paths
    assets.forEach((asset) => {
        eleventyConfig.addPassthroughCopy({
            [path.resolve(__dirname, `../resources/${asset}`)]: `assets/${asset}`
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
        const [opening, closing] = {
            curly: ['{{', '}}'],
            call: ['{%', '%}'],
            silent: ['{%-', '-%}'],
        }[type];

        return `${opening}${content}${closing}`;
    });

    eleventyConfig.addFilter('toRem', function (value) {
        return parseInt(value) / 16 + 'rem';
    });

    /* Adds prefix to urls */
    eleventyConfig.addGlobalData('root', process.env.prefix);
    eleventyConfig.addNunjucksGlobal('root', process.env.prefix || '');

    /* Server options */
    eleventyConfig.setServerOptions({
        watch: [
            'dist/assets/scripts/**/*.*',
            'dist/assets/styles/**/*.*',
        ],
        liveReload: true,
        domDiff: true,
    });

    eleventyConfig.addWatchTarget("./src/**/*");

    /* Unique id */
    eleventyConfig.addNunjucksGlobal('uid', () => {
        return `${Date.now() + Math.floor(Math.random() * 1000)}`;
    });

    /* Custom filters */
    eleventyConfig.addFilter('toClassNames', function (arr) {
        const classes = arr.filter((item) => Boolean(item)).join(' ');
        if (classes) return ' ' + classes;

        return '';
    });

    eleventyConfig.addFilter('toStyleString', function (arr) {
        const styles = arr.filter((item) => Boolean(item)).join(';');
        if (styles) return ' style="' + styles + '"';

        return '';
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
