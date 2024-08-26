const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function buildPlugins() {
    return [
        new WebpackBar(),
        new MiniCssExtractPlugin({
            filename: 'assets/styles/[name].css',
        }),
        //new BundleAnalyzerPlugin(),
    ];
}

exports.buildPlugins = buildPlugins;
