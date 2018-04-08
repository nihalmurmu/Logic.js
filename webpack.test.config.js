const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.js');

config.mode = 'development';
config.entry = './src/test/ts/test.ts';
config.output.path = path.resolve(__dirname, 'dist/test');
config.plugins.push(new HtmlWebpackPlugin());

module.exports = config;