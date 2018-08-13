# webpack learn note


### script

 显示编译进程 --progress
#### 加载css
```
    //loader
        npm install --save-dev style-loader css-loader
    
    //config
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
   
    //js
        import './fileName.css';

```
#### 加载图片
    //loader
        npm install --save-dev file-loader

    //config
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: ['file-loader']
        }

    //js
        ```javascript
        import Icon from './icon.png';
        ```
#### 加载字体
```
    //loader
        npm install --save-dev file-loader url-loader 

    //project
        src/fileName.woff
        src/fileName.woff2
        ...eot|ttf|otf

    //config
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: ['file-loader']
        }

    //css
        @font-face {
          font-family: 'myfont';
          font-style: normal;
          font-weight: 400;
          src: url('./aguafina-script-v6-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
               url('./aguafina-script-v6-latin-regular.woff') format('woff'); /* Modern Browsers */
        }
        .demo {
          font-family: 'myfont';
        }

```


提取第三方库
方便长期缓存第三方的库,新建一个入口，把第三方库作为一个chunk，生成vendor.js
module.exports = {
    entry: {
        main: './src/index.js',
        vendor: ['react', 'react-dom'],
    },
}

DLL动态链接
第三库不是经常更新，打包的时候希望分开打包，来提升打包速度。打包dll需要新建一个webpack配置文件，在打包dll的时候，webpack做一个索引，写在manifest文件中。然后打包项目文件时只需要读取manifest文件。


备注：
第一张图的build前面不加 / 的话，这个地址会拼在你当前地址栏地址的后面
如果加了/ 那就会是在域名后面拼上你的地址


http://127.0.0.1:8012/webpack-dev-server 可以查看dev编译出的目录
确保 publicPath 总是以斜杠(/)开头和结尾。

代码检查loader
模拟数据：前端mock数据
打包结果分析 BundleAnalyzerPlugin

babel plugin

```
npm i --save-dev babel-loader babel-core babel-preset-env
babel-loader 用于让 webpack 知道如何运行 babel
babel-core 可以看做编译器，这个库知道如何解析代码
babel-preset-env 这个库可以根据环境的不同转换代码
```

## Q

.logo.png 1934*812 太大了。