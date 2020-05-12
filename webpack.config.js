const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'production',
    entry: {
        'vue-scroll-numbers': './src/index.js'
    },
    externals: {
        'vue': 'Vue'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].min.js',
        libraryTarget: 'umd',
        library: 'VueScrollNumbers',
        globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
    resolve: {
        extensions: ['.js', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: "vue-loader"
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: [
                    "css-loader",
                    "sass-loader",
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.BannerPlugin({
            banner: `vue-scroll-numbers v${require('./package.json').version}\n(c) ${new Date().getFullYear()} Calvin Von\nReleased under the MIT License.`
        })
    ]
}