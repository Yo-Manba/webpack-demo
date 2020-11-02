/**
 * HMR: hot module replacement 热模块替换
 * 作用: 一个模块发生变化，只会重新打包这一个模块，而不是打包所有，这样会极大提升构建速度
 * 
 * 1. 样式文件: 可以使用 HMR 功能，因为 style-loader 内部实现了
 * 2. js文件: 默认不能使用 HMR 功能（需要做 HMR 功能）  解决方法: 修改 js 代码，添加支持 HMR 功能的代码, 注意：HMR 功能对 js 文件的处理，只能处理非入口文件的其他 js 文件。
 * 3. html文件: 默认不能使用 HMR 功能，同时会导致一个问题，html 文件不能热更新了（不需要做 HMR 功能）     解决方法: 修改 entry 入口, 讲 html 文件引入
 */

const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 打包的入口文件路径
    entry: [
        './src/js/index.js', 
        './src/index.html',
    ],
    
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
        // 开启 HMR 功能
        hot: true
    }
}
