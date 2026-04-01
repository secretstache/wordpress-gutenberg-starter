/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
    stories: ['../src/**/*.stories.@(jsx|tsx)'],
    staticDirs: ['../../resources'],
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

        return config;
    },
};

export default config;
