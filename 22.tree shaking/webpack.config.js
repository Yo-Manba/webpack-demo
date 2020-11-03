const {resolve} = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');    // 提取样式到单独文件的插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');   // 压缩css代码的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * tree shaking：去除无用代码
 * 使用前提：1.必须使用ES6模块化    2.开启production环境
 * 
 * 在package.json中配置：
 *      "sideEffects": false   左右代码都没有副作用（都可以进行tree shaking）
 *       问题：可能会把 css、@babel/polyfill 文件干掉
 *      
 *      "sideEffects": ["*.css"],  会把css文件保留下来
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