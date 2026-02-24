import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { processCSSFunctions } from '../shared/vite-css.js';
import postcssCustomMedia from 'postcss-custom-media';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function resolveAliases() {
    return {
        name: 'resolve-aliases',
        transform(code, id) {
            const normalizedId = id.split('?')[0];

            if (normalizedId.endsWith('.css')) {
                if (normalizedId.includes('defaultBlocksStyles.css')) {
                    return;
                }

                // Replace @images alias
                code = code.replace(/url\(["']?@images\/([^"')]+)["']?\)/g, (match, imgPath) => {
                    return `url("../images/${imgPath}")`;
                });

                // Replace @fonts alias with relative path
                code = code.replace(/url\(["']?@fonts\/([^"')]+)["']?\)/g, (match, fontPath) => {
                    return `url("../fonts/${fontPath}")`;
                });

                return { code };
            }
        },
    };
}

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development';

    return {
        css: {
            postcss: {
                plugins: [
                    postcssCustomMedia(),
                ],
            },
        },
        plugins: [
            resolveAliases(),
            processCSSFunctions(),
            tailwindcss(),
        ],
        build: {
            outDir: 'dist/assets',
            emptyOutDir: false,
            manifest: false,
            sourcemap: isDev,
            minify: !isDev,
            watch: isDev ? {} : null,
            rollupOptions: {
                input: {
                    'scripts/app': resolve(__dirname, '../resources/scripts/client/app.js'),
                    'scripts/design-system': resolve(__dirname, 'src/partials/design-system/assets/design-system-scripts.js'),
                    'styles/app': resolve(__dirname, '../resources/styles/app.css'),
                    'styles/defaultBlockStyles': resolve(__dirname, '../resources/styles/defaultBlocksStyles.css'),
                    'styles/gravity': resolve(__dirname, './src/assets/styles/gravity/gravity.css'),
                },
                output: {
                    entryFileNames: '[name].js',
                    chunkFileNames: '[name].js',
                    assetFileNames: '[name][extname]',
                },
            },
        },
        resolve: {
            alias: {
                '@scripts': resolve(process.cwd(), '../resources/scripts'),
                '@modules': resolve(__dirname, '../node_modules'),
            },
        },
    };
});
