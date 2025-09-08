import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import laravel from 'laravel-vite-plugin';
import { wordpressPlugin, wordpressThemeJson } from '@roots/vite-plugin';
import eslint from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';
import svgLoader from 'vite-plugin-svgr';
import { resolve } from 'path';

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
        plugins: [
            tailwindcss(),
            laravel({
                input: [
                    'resources/scripts/client/app.js',
                    'resources/scripts/editor/editor.js',
                    'resources/styles/app.css',
                    'resources/styles/editor-canvas.css',
                    'resources/styles/editor-ui.css',
                    'resources/styles/admin.css',
                ],
                refresh: true,
            }),

            wordpressPlugin(),

            eslint({
                include: ['resources/scripts/**/*.{js,jsx}'],
                exclude: ['node_modules', 'public', 'static'],
                fix: false,
                cache: true,
                emitWarning: false,
                failOnWarning: false,
                failOnError: false,
            }),

            stylelint({
                include: ['resources/styles/**/*.{css}'],
                exclude: ['node_modules', 'public', 'static'],
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

            wordpressThemeJson({
                layout: {
                    contentSize: '1240px',
                    wideSize: '1440px',
                },
                color: {
                    custom: false,
                    customDuotone: false,
                    customGradient: false,
                    defaultDuotone: false,
                    defaultGradients: false,
                    defaultPalette: false,
                    duotone: [],
                },
                spacing: {
                    margin: true,
                    padding: true,
                    customMargin: true,
                    customPadding: true,
                    units: ['px', '%', 'em', 'rem', 'vw', 'vh'],
                },
                typography: {
                    customFontSize: false,
                },
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

