const {
    resolve
} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: resolve(__dirname, 'build'),
        filename: 'js/build.js'
    },
    module: {
        rules: [
            /**
             * js 兼容性处理需要的库：babel-loader @babel/core @babel/preset-env
             * 1. 基本的 js 语法兼容性处理使用库：@babel/preset-env  问题：只能转换基本的语法，比如promise不能转换
             * 2. 全部的 js 语法兼容性使用库： @babel/polyfill      问题: 我只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了
             * 3. 需要做兼容性处理的就做，实现按需加载，使用库：core-js  使用第三种方案的话就不能使用第二种方案，需要注释掉 @babel/polyfill 的引入
             */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // 预设：指示babel做怎么样的兼容性处理
                        presets: [
                            ['@babel/preset-env', {
                                // 按需加载
                                useBuiltIns: 'usage',
                                // 指定core-js版本
                                corejs: {
                                    version: 3
                                },
                                // 指定兼容性做到哪个版本浏览器
                                targets: {
                                    chrome: '60',
                                    firefox: '50',
                                    ie: '9',
                                    safari: '10',
                                    edge: '17'
                                }
                            }]
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    mode: 'development'
}
