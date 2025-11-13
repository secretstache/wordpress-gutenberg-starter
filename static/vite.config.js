import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { processCSSFunctions } from '../shared/vite-css.js';
import postcssCustomMedia from 'postcss-custom-media';

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
                '@scripts': resolve(__dirname, '../resources/scripts'),
                '@images': resolve(__dirname, '../resources/images'),
                '@fonts': resolve(__dirname, '../resources/fonts'),
                '@modules': resolve(__dirname, '../node_modules'),
                '@styles': resolve(__dirname, '../resources/styles'),
            },
        },
    };
});
