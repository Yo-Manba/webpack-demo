const {
    resolve
} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 定义nodejs环境变量：决定使用 browserlist 的哪个环境
process.env.NODE_ENV = 'production'

module.exports = {
    entry: {
        // 多入口：几个入口就输出几个bundle
        index: './src/js/index.js',
        test: './src/js/test.js'
    },
    output: {
        path: resolve(__dirname, 'build'),
        filename: 'js/[name].[contenthash:10].js'  // [name] 取文件名
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            // 压缩 html 代码
            minify: {
                collapseWhitespace: true, // 移除空格
                removeComments: true // 移除注释
            }
        })
    ],
    // mode为production时，js代码会自动压缩
    mode: 'production'
}
