/*!
* @Author: fanger
* @Date:   2018-03-12 10:53:20
 * @Last Modified by: Teaism
 * @Last Modified time: 2018-08-22 15:03:27
*/

const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const glob = require('glob');
const ImageminPlugin = require('imagemin-webpack-plugin').default;



module.exports = merge(base, {
  devtool: 'null',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin({sourceMap: true}),
    // 图片压缩
    // new ImageminPlugin({
    //   test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
    //   optipng: {
    //     optimizationLevel: 5
    //   },
    //   gifsicle: {
    //     optimizationLevel: 3
    //   },
    //   pngquant: {
    //     quality: '50-70'
    //   },
    //   externalImages: {
    //     context: 'src', // Important! This tells the plugin where to "base" the paths at
    //     sources: glob.sync('src/assets/uploads/**/*.*'),
    //     destination: '/dist/'
    //   }
    // }),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})
  ]
});



