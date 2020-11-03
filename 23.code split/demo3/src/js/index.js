// import {mul} from './test'

function sum(...args) {
    return args.reduce((a, b) => a + b, 0);
}

/**
 * 通过js代码，让某个文件被单独打包成一个chunk
 * import动态导入语法：能将某个文件单独打包
 */

import(/* webpackChunkName: 'test' */'./test')
    .then(({mul,count}) => {
        console.log(res)
        // eslint-disable-next-line
        console.log(mul(2, 2));
    })
    .catch(() => {
        // eslint-disable-next-line
        console.log('文件加载失败');
    })

// eslint-disable-next-line
console.log(sum(1, 2, 3, 4, 5));
