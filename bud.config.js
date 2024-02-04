export default async (app) => {
    app.build.setRule('svg', {
        test: /\.inline\.svg$/i,
        issuer: /\.js$/,
        use: [
            {
                loader: '@svgr/webpack',
                options: {
                    svgoConfig: {
                        plugins: [
                            {
                                name: 'preset-default',
                                params: { overrides: { removeViewBox: false } },
                            },
                        ],
                    },
                },
            },
        ],
    });

    app
        .entry('app', [ '@scripts/client/app', '@styles/app' ])
        .entry('editor', [ '@scripts/editor/editor', '@styles/editor' ])
        .entry('admin', [ '@styles/admin' ])
        .assets([ 'images' ]);

    app.setPublicPath('/wp-content/themes/sage/public/');

    app
        .setUrl('http://localhost:3000')
        .setProxyUrl(process.env.WP_HOME)
        .watch([ 'resources/views', 'resources/styles', 'resources/scripts', 'app' ]);

    app.eslint
        .extends([ '@roots/eslint-config' ])
        .setRules({ 'no-console': 'error' })
        .setFailOnError(false)
        .setFailOnWarning(false);

    app.devtool(`eval-source-map`);
};
