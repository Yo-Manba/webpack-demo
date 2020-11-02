const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostcssPresetEnv = require('postcss-preset-env');

// 设置 nodejs 环境变量
process.env.NODE_ENV = "development";

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: resolve(__dirname, 'build'),
        filename: 'js/build.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                /**
                 * css 兼容性处理：postcss --> postcss-loader postcss-preset-env
                 * 帮助 postcss 找到 package.json 中 browserslist 里面的配置，通过配置加载指定的 css 兼容性样式
                 * 
                 * 默认是看生产环境，如需查看开发环境，设置 process.env.NODE_ENV = "development"
                 * "browserslist": {
                        "development": [
                            "last 1  chrome version",
                            "last 1  firefox version",
                            "last 1  safari version"
                        ],
                        "production": [
                            ">0.2%",
                            "not dead",
                            "not op_mini all"
                        ]
                    }
                 *
                 */
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            ident: 'postcss',
                            plugins: () => [
                                // postcss的插件
                                new PostcssPresetEnv()
                            ]
                        }

                    }
                }
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/build.css'
        })

    ],
    mode: 'development'
}
