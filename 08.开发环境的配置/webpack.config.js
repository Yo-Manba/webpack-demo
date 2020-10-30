const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 打包的入口文件路径
    entry: './src/js/index.js',
    
    // 打包的输出文件路径
    output: {
        path: resolve(__dirname, 'build'),
        filename: 'js/build.js'
    },
    
    // 模块
    module: {
        rules: [
            {   
                // 打包less资源
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                // 打包css资源
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {   
                // 打包css样式中的图片资源
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    esModule: false,
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs'
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
                    name: '[hash:10].[ext]',
                    outputPath: 'media'
                }
            }
        ]
    },
    
    // 插件
    plugins: [
        // 打包html资源
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    
    // 模式
    mode: 'development',
    
    /**
     * 开发服务器配置
     * 运行指令：
     *      webpack 会将打包结果输出出来
     *      npx webpack-dev-server  只会在内存中编译打包，不会有输出结果
     */ 
    devServer: {
        contentBase: resolve(__dirname, 'build'),       // 设置要运行的项目的目录路径（构建后的项目目录）
        compress: true,     // 启动gzip压缩
        port: 3000,         // 设置端口号
        open: true,         // 是否自动打开浏览器
    }
}
