const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const isBlocks = process.env.project === 'blocks';

function buildLoaders() {
    const jsLoader = {
        test: /\.js$/,
		resolve: {
			fullySpecified: false,
		},
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        '@babel/preset-env',
                        { targets: 'defaults' },
                    ],
                ],
            },
        },
    };

    const cssLoader = [
        {
            test: /\.s[ac]ss$/i,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        url: true,
                        sourceMap: true,
                    },
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                require.resolve('autoprefixer'),
                            ],
                        },
                    },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        additionalData: '$isBlocks: ' + isBlocks + ';',
                    },
                },
            ],
        },
    ];

    return [
        jsLoader,
        ...cssLoader,
    ];
}

exports.buildLoaders = buildLoaders;
