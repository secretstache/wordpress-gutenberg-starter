const path = require('path');
const { buildWebpackConfig } = require('./config/build/buildWebpackConfig');

const paths = {
    entry: {
        app: [
            path.resolve('../resources/scripts/client/app.js'),
            path.resolve('../resources/styles/app.scss'),
        ],
        'design-system': [
            path.resolve(__dirname, 'src', 'partials/design-system/assets/design-system-scripts.js'),
            path.resolve(__dirname, 'src', 'partials/design-system/assets/design-system-styles.scss'),
        ],
    },
    dist: path.resolve(__dirname, 'dist'),
    src: path.resolve(__dirname, 'src'),
};

const mode = process.env.mode || 'development';
const isDev = mode === 'development';

const config = buildWebpackConfig({
    mode,
    paths,
    isDev,
});

module.exports = config;
