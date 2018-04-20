const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  mode: 'development', //指定模式, 有development 和 production

  // entry: './src/script/index.js', // 打包单入口文件（简写）

  // entry: ['./src/script/index.js', './src/script/a.js'], // 多入口文件（简写）

  /*entry: {
    index: './src/script/index.js', //单入口文件（可拓展写法）
  },*/

  /*entry: {
    index: ['./src/script/index.js', './src/script/a.js'] // 多入口文件（可拓展写法）
  },*/

  entry: {
    main: './src/script/index.js', // 打包生成多个文件 这里生成2个文件 注意出口文件名不能写死 否则生成的第二个文件会覆盖第一个文件，导致最终生成一个文件
    a: './src/script/a.js',
    b: './src/script/b.js'
  },

  output: {   // 出口文件信息
    path: path.join(__dirname, './dist'), // 出口文件存放路径（4.x版本必须是绝对路径）
    filename: 'js/[name]-[chunkhash].js', // 出口文件名称 前面'js/'为了输出在'/dist/js'目录 [name]-[chunkhash].js [name]就是entry中的key值 [chunkhash]为每次打包的chunkhash chunkhash只有文件更改后再打包会改变 [hash]就是每次打包的hash
    publicPath: "http://cdn.com/" // 这是用于在生成的html文件中引入js时的路径前拼接publicPath用于项目直接上线使用
  },
  plugins: [
    new htmlWebpackPlugin({ //生成html文件
      template: 'index.html', //生成html的模板文件路径 webpack默认根目录 'index.html'就是根目录下的index.html
      filename: 'index.html', // 指定生成文件名
      inject: false, // script标签放在哪个标签下 false 则是一个都不js引用
      title: 'this is a.html', // 在模板中通过<%= htmlWebapckPlugin.optinos.title %> 填充title的键值
      // minify: { // 缩小文件大小的配置
      //   removeComments: true, // 删除注释
      //   collapseWhitespace: true // 删除空格  还有很多参数可以按需配置
      // },
      // chunks: ['main'],  // 指定插入的chunk 配置该项inject参数一定不能为false 'main'代表只引入指定chunk 也就是指定entry中key为'main'的js
      excludeChunks: ['b']  // 排除b chunk 其他的chunk都引入
    }),
    // 生成多个html 调用多次即可
    new htmlWebpackPlugin({
      template: 'index.html',
      filename: 'a.html',
      inject: false,
      title: 'this is a.html',
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true
      // },
      // chunks: ['a']
      excludeChunks: ['b']
    })
  ]
}