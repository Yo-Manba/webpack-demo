const {
    resolve
} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 定义nodejs环境变量：决定使用 browserlist 的哪个环境
process.env.NODE_ENV = 'production'

module.exports = {
    // 单入口
    // entry: './src/js/index.js',
    // 多入口
    entry: {
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
    /**
     * 可以将node_modules中代码单独打包一个chunk最终输出
     * 自动分析多入口chunk中有没有公共的文件，如果有会打包成单独的一个chunk
     */ 
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    // mode为production时，js代码会自动压缩
    mode: 'production'
}
