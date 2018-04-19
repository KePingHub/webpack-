require('./demo.js')

// require('./style.css')
// 执行 webpack --mode development 
// --mode development 代表模式是development
// 报错 提示没有loader处理css文件

// require('css-loader!./style.css')
// 使用css-loader处理css文件，可以打包，但是html上样式不生效

// require('style-loader!css-loader!./style.css')
//style-loader作用是将css-loader处理css文件生成的代码用style标签包裹并插入到html中

require('./style.css')
// 可以使用命令行使用loader去处理css文件
// webpack --mode development --module-bind 'css=style-loader!css-loader'
// webpack --mode development --module-bind 'css=style-loader!css-loader' --watch
// --watch 作用是只要文件修改了便会重新执行该命令
// --progress 作用是显示打包过程信息
function hello() {
  alert('hello world123')
}

hello()
