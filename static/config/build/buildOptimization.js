const TerserPlugin = require('terser-webpack-plugin');

function buildOptimization() {
    return {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    enforce: true,
                    chunks: 'all',
                },
            },
        },
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
    };
}

exports.buildOptimization = buildOptimization;
