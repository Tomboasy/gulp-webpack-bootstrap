const webpack = require('webpack');
const WebpackConfig = require('webpack-config').Config;

module.exports = new WebpackConfig().extend('./webpack.config.js').merge({
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            }
        }),
    ]
})