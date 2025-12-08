import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import laravel from 'laravel-vite-plugin';
import { wordpressPlugin, wordpressThemeJson } from '@roots/vite-plugin';
import eslint from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';
import svgLoader from 'vite-plugin-svgr';
import { resolve } from 'path';
import { processCSSFunctions } from './shared/vite-css.js';
import postcssCustomMedia from 'postcss-custom-media';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const origin = env.APP_URL;

    return {
        base: '/wp-content/themes/THEME_PUBLIC_PATH_NAME/public/build',
        server: {
            cors: {
                origin: origin,
                credentials: false,
            },
        },
        build: {
            sourcemap: true,
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        // Keep critical.js standalone - no splitting
                        if (id.includes('resources/scripts/client/critical')) {
                            return 'critical';
                        }
                    },
                },
            },
        },
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
            laravel({
                input: [
                    'resources/scripts/client/critical.js',
                    'resources/scripts/client/app.js',
                    'resources/scripts/editor/editor.js',
                    'resources/styles/app.css',
                    'resources/styles/defaultBlocksStyles.css',
                    'resources/styles/editor-canvas.css',
                    'resources/styles/editor-ui.css',
                    'resources/styles/admin.css',
                ],
                refresh: true,
            }),

            wordpressPlugin(),

            wordpressThemeJson({
                disableTailwindColors: false,
                disableTailwindFonts: false,
                disableTailwindFontSizes: false,
            }),

            eslint({
                include: ['resources/scripts/**/*.{js,jsx}'],
                exclude: [
                    'node_modules',
                    'public',
                    'static',
                ],
                fix: false,
                cache: true,
                emitWarning: false,
                failOnWarning: false,
                failOnError: false,
            }),

            stylelint({
                include: ['resources/styles/**/*.{css}'],
                exclude: [
                    'node_modules',
                    'public',
                    'static',
                ],
                fix: false,
                cache: true,
                emitWarning: true,
                failOnWarning: false,
                failOnError: true,
            }),

            svgLoader({
                defaultImport: 'raw',
                svgo: true,
                svgoConfig: {
                    multipass: true,
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                },
                            },
                        },
                    ],
                },
                include: '**/*.inline.svg',
            }),
        ],
        resolve: {
            alias: {
                '@scripts': resolve(process.cwd(), 'resources/scripts'),
                '@styles': resolve(process.cwd(), 'resources/styles'),
                '@fonts': resolve(process.cwd(), 'resources/fonts'),
                '@images': resolve(process.cwd(), 'resources/images'),
                '@modules': resolve(process.cwd(), 'node_modules'),
            },
        },
    };
});
