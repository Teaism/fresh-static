/*!
 * @Author: fanger
 * @Date:   2018-03-12 10:53:12
 * @Last Modified by: Teaism
 * @Last Modified time: 2018-06-05 19:28:43
 */

const path = require('path');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CopyWebpackPluginVendor = require('copy-webpack-plugin');
const glob = require('glob');

// 获取指定路径下的多入口文件返回{name: path}
// __dirname”是node.js中的一个全局变量，它指向当前执行脚本所在的目录H:\WWW\aaa\lnwebpack。
var pagesEntry = getEntry(path.join(__dirname, 'src/pages/**/*.js'));

function getEntry(globPath) {
  let entries = {};
  glob.sync(globPath).forEach(function (path) {
    // 裁剪路径字符串为想要的入口名(为多入口生成对应目录层级)
    let name = path.slice(path.lastIndexOf('src/') + 4, path.length - 3);
    name = name.slice(0, name.lastIndexOf('/'));
    entries[name] = path;
  });
  return entries;
}

// 基础配置
const modeEnv = process.env.NODE_ENV === 'production' ? true : false;

const webpackConfig = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: pagesEntry,
  module: {
    rules: [{
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: modeEnv,
                importLoaders: 2
              }
            }, {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                importLoaders: 1
                // 指定启用css modules
                // modules: true,  
                // 指定css的类名格式
                // localIdentName: '[name]__[local]--[hash:base64:5]' 
              }
            },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            context: 'src/',
            limit: 8192,
            // 因为已复制图片到dist,避免重复这里处理后不改变图片文件名
            // name: '[path]/[name].[hash:8].[ext]'
            name: '[path]/[name].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    // 提取css
    new ExtractTextPlugin({
      //输出的路径及文件名
      filename: '[name]/[contenthash].css',
      allChunks: true
      // disable: process.env.NODE_ENV === '"development"'
    }),
    // 复制src/pages/静态资源图片到build(dist)下
    new CopyWebpackPlugin([{
      // 通过context: 'src/'复制时直接从src/下复制到build下
      context: 'src/',
      from: '**/*',
      toType: 'dir'
    }], {
      ignore: ['*.html', '*.js', '*.scss', '*.css']
    }),
    new CopyWebpackPluginVendor([{
      // 直接复制vendor到dist下
      context: 'src/',
      from: 'assets/vendor/**/*',
      toType: 'dir'
    }])
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    // 发布地址，打包文件中所有相对路径引用的资源都会被配置的路径所替换。
    // publicPath: path.join(__dirname, 'dist'),
    filename: '[name]/[hash].js',
    chunkFilename: '[name]/[name].[hash:5].bundle.js'
  }
};


// 遍历页面目录生成多入口
Object.keys(pagesEntry).forEach(function (pathname) {
  let fileOut = path.join(__dirname, 'dist/' + [pathname] + '/' + pathname.slice(pathname.lastIndexOf('/')) + '.html');
  let tmplOrigin = path.join(__dirname, 'src/' + [pathname] + '/' + pathname.slice(pathname.lastIndexOf('/')) + '.html');
  // 每个页面生成一个html
  let htmlPluginConf = {
    // 生成出来的html存放路径
    filename: fileOut,
    // 模板路径
    template: tmplOrigin,
    // 注入所有js静态资源到html
    inject: false
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    // chunksSortMode: 'dependency',
  };

  // console.log(pathname)

  // 注入当前每个html引用的自己路径下的js模块，也可以在这里加上vendor等公用模块
  if (pathname in pagesEntry) {
    htmlPluginConf.inject = true;
    htmlPluginConf.chunks = ['manifest', 'vendor', pathname];
  }
  webpackConfig.plugins.unshift(new HtmlWebpackPlugin(htmlPluginConf));
});

module.exports = webpackConfig;