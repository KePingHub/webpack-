const path = require('path')

module.exports = {
  mode: 'development', //指定模式, 有development 和 production
  // entry: './src/script/index.js', // 打包单入口文件（简写）
  // entry: ['./src/script/index.js', './src/script/a.js'], // 多入口文件（简写）
  // entry: {
  //   index: './src/script/index.js', //单入口文件（可拓展写法）
  // },
  // entry: {
  //   index: ['./src/script/index.js', './src/script/a.js'] // 多入口文件（可拓展写法）
  // },
  entry: {
    index: './src/script/index.js', // 打包生成多个文件 这里生成2个文件 注意出口文件名不能写死 否则生成的第二个文件会覆盖第一个文件，导致最终生成一个文件
    a: './src/script/a.js',
  },
  output: {   // 出口文件信息
    path: path.join(__dirname, './dist/js'), // 出口文件存放路径（4.x版本必须是绝对路径）
    filename: '[name]-[hash]-[chunkhash].js' // 出口文件名称 [name]-[chunkhash].js [name]就是entry中的key值 [chunkhash]为每次打包的chunkhash chunkhash只有文件更改后再打包会改变 [hash]就是每次打包的hash
  }
}