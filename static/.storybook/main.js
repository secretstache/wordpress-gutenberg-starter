import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
    stories: ['../src/**/*.stories.@(jsx|tsx)'],
    staticDirs: [
        { from: '../../resources/fonts', to: '/assets/fonts' },
        { from: '../../resources/images', to: '/assets/images' },
        { from: '../../resources/video', to: '/assets/video' },
    ],
    addons: [
        '@storybook/addon-docs',
        '@whitespace/storybook-addon-html',
        '@storybook/addon-designs',
        '@storybook/addon-a11y',
        '@storybook/addon-vitest',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    viteFinal: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.base = '/static/storybook/';
        }

        // Storybook's Vite builder REPLACES `server` wholesale with its own object
        // (`{ middlewareMode, hmr, fs: { strict: true } }`), so `server.fs.allow`
        // from static/vite.config.js is discarded. Stories live in static/ but
        // src/index.css pulls in ../../resources/styles/app.css, whose @font-face
        // rules point at the theme root's node_modules/@fontsource-variable/*.
        // Without re-allowing the theme root those .woff2 requests 403 and every
        // story silently falls back to Helvetica. viteFinal runs last, so this wins.
        config.server = {
            ...config.server,
            fs: {
                ...config.server?.fs,
                allow: [
                    ...(config.server?.fs?.allow ?? []),
                    resolve(__dirname, '../..'),
                ],
            },
        };

        return config;
    },
};

export default config;
