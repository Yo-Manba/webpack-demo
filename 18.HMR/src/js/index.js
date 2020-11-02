import '../less/index.less'
import print from './print.js'

console.log('index.js 被加载了！！！！！');

print();

// 一旦 module.hot 为 true ， 说明开启了 HMR 功能， ———> 让 HMR 代码生效
if (module.hot) {
    // 方法会监听 print.js 文件的变化，一旦发生变化，让其他模块不会重新打包构建
    module.hot.accept('./print.js', function(){
        print();
    })
}
