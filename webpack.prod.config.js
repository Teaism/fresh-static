/*!
* @Author: fanger
* @Date:   2018-03-12 10:53:20
 * @Last Modified by: Teaism
 * @Last Modified time: 2018-05-02 15:06:08
*/

const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const glob = require('glob');

module.exports = merge(base, {
  devtool: 'null',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin({sourceMap: true}),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})
  ]
});



