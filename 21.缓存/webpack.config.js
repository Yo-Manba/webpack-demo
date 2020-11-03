const {resolve} = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');    // 提取样式到单独文件的插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');   // 压缩css代码的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 缓存：
 *      babel缓存
 *          cacheDirectory：true
 *          让第二次打包构建速度更快
 *      
 *      文件资源缓存
 *          hash：每次webpack构建时会生成一个唯一的hash值。
 *          问题：因为js和css同时使用一个hash值，如果重新打包，会导致所有缓存失效，而我只改变了一个文件。
 *              
 *          chunkhash：根据chunk生成的hash值，如果打包来自于同一个chunk，那么hash值就一样。
 *          问题：js和css的hash值还是一样的，因为css是在js中被引入的，所以同属于一个chunk
 *      
 *          contenthash：根据文件的内容来生成hash值，不同文件的hash值一定不一样
 *          让代码在线上运行时缓存更好用
 */

// 定义nodejs环境变量：决定使用 browserlist 的哪个环境
process.env.NODE_ENV = 'production'

// 复用loader
const commonCssLoader = [
    // 把js中的css代码提取成单独的css文件
    MiniCssExtractPlugin.loader,
    // 把css代码加载到js中
    'css-loader',
    // 对css代码进行兼容性处理
    {   
        // 同时需要在 package.json 中定义 browserlist
        loader: 'postcss-loader',
        options: {
            postcssOptions: {
                ident: 'postcss',
                plugins: () => [
                    // 样式的兼容性处理插件          
                    require('postcss-preset-env')()
                ]
            }
        }
    }
];

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: resolve(__dirname, 'build'),
        filename: 'js/build.[contenthash:10].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // 当前loader优先执行
                enforce: 'pre',
                // js代码格式规范检测，同时需要在 package.json 中配置 eslintConfig --> airbnb
                loader: 'eslint-loader',
                options: {
                    // 格式自动修复
                    fix: true
                }
            },
            {
                // 以下loader只会匹配一个，不能有两个配置处理同一种类型文件
                oneOf: [
                    {
                        test: /\.css$/,
                        use: [
                            ...commonCssLoader
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            ...commonCssLoader,
                            // 把less代码转换成css代码
                            'less-loader'
                        ]
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        // js代码的兼容性处理
                        loader: 'babel-loader',
                        options: {
                            // 预设：指示babel做怎么样的兼容性处理
                            presets: [
                                ['@babel/preset-env',{
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
                            ],
                            // 开启babel缓存，第二次构建的时候，会读取之前的缓存
                            cacheDirectory: true
                        }
                    },
                    {
                        test: /\.(jpg|png|gif)/,
                        loader: 'url-loader',
                        options: {
                            limit: 8 * 1024,
                            name: '[hash:10].[ext]',
                            outputPath: 'imgs',
                            esModule: false
                        }
                    },
                    {
                        test: /\.html$/,
                        loader: 'html-loader'
                    },
                    {
                        exclude: /\.(js|css|less|html|jpg|png|gif)/,
                        loader: 'file-loader',
                        options: {
                            outputPath: 'media'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/build.[contenthash:10].css'
        }),
        new OptimizeCssAssetsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            // 压缩 html 代码
            minify: {
                collapseWhitespace: true,   // 移除空格
                removeComments: true    // 移除注释
            }
        })
    ],
    // mode为production时，js代码会自动压缩
    mode: 'production'
}