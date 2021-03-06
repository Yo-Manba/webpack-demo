const {
    resolve
} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: resolve(__dirname, 'build'),
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {   
                // 打包css样式中的图片资源
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    esModule: false,
                    name: '[hash:10].[ext]'
                }
            },
            {
                // 打包html资源，主要用于将图片资源引入，使url-loader可以对html中的img资源进行打包
                test: /\.html$/,
                loader: 'html-loader'
            },
            {   
                // 打包除此以外的其他资源
                exclude: /\.(css|js|html|less|jpg|png|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    mode: 'development',
    
    // 开发服务器
    devServer: {
        contentBase: resolve(__dirname, 'build'),       // 设置要运行的项目的目录路径（构建后的项目目录）
        compress: true,     // 启动gzip压缩
        port: 3000,         // 设置端口号
        open: true,         // 是否自动打开浏览器
    }
}
