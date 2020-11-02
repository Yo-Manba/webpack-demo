const {resolve} = require('path');
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
             * 语法检查：eslint-loader eslint
             * 注意：eslint-loader 只检查用户自己写的源代码，第三方的库是不检查的
             * 设置检查规则：package.json 中 eslintConfig 中设置，推荐使用 Airbnb 规则：eslint-config-airbnb-base && eslint && eslint-plugin-import
             * 
             * "eslintConfig": {
                    "extends": "airbnb-base"
                }
             * 
             */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    // 自动修复 eslint 错误
                    fix: true
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
