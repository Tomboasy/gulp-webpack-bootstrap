const path = require('path');
const webpack = require('webpack');

var PATHS = require('./paths.json');

module.exports = {
    output: {
        path: path.resolve(__dirname, PATHS.dist.js),
        filename: '[name].js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['es2015']
            }
        }],
    },
};