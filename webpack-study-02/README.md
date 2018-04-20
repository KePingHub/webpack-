# webpack配置webpack.config.js简化打包命

当执行webpack 打包命令时默认会查找项目根目录下的webpack.config.js，如果存在该文件,则读取其中的webpack打包配置执行打包命令

## 1.配置入口文件

- 在根目录下新建webpack.config.js

```javascript

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
    b: './src/script/b.js'
  }
}

```
- 当mode为'development'时:
    
    会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。
- 当mode为'production'时：

    会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin.

ps：注意路径一定要看仔细了，我打包时一直报错一直找不到原因，一开始上Stack Overflow，segmentFault，github各种查找原因，无果。
    最后不得重新写一个配置文件，最后成功了，纠结这是为啥，到最后仔细核对下发现'./src'被我写成'./scr'，是真的难发现，真的想抽自己一下 （- -|||）


接下来配置其他参数，就直接在上面导出的对象里加键值对就行了
## 2. 配置出口文件

```
const path = require('path') // path是nodejs用于处理文件路径的模块

module.export = {
  mode: 'development',
  entry: {
    index: './src/script/index.js', // 打包生成多个文件 这里生成2个文件 注意出口文件名不能写死 否则生成的第二个文件会覆盖第一个文件，导致最终生成一个文件
    a: './src/script/a.js',
    b: './src/script/b.js'
  },
  output: {   // 出口文件信息
    path: path.join(__dirname, './dist/js'), // 出口文件存放路径（4.x版本必须是绝对路径）__dirname就是当前的文件的绝对路径
    filename: '[name]-[hash]-[chunkname].js' // 出口文件名称 [name]-[chunkhash].js [name]就是entry中的key值 [chunkhash]为每次打包生成的 chunkhash只有文件更改后再打包会改变 [hash]就是每次打包生成的hash值
  }
}

```

我们接下来如何引用打包后的文件呢? 因为可能每次都会生成不同的文件名，每次都去手动引入到我们的html中太繁琐了，
html-webpack-plugin 就可以解决这个问题
> npm install html-webpack-plugin -D  安装这个插件

## 3. 配置插件
```
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin') // 引入插件

module.exports = {
  mode: 'development',
  entry: {
    main: './src/script/mian.js',
    a: './src/script/a.js',
    b: './src/script/b.js'
  },
  output: {
    path: path.join(__dirname, './dist/js'),
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new htmlWebpackPlugin() // 实例化插件
  ]
}

```

现在打包就可以发现在'./dist/js'目录下生成了index.html文件并引入了我们打包后的js文件
但是我们并不想html文件在js目录下, 可以这样解决这个问题:

```javascript

/*output: {
  path: path.join(__dirname, './dist/js'),
  filename: '[name].[chunkhash].js'
}*/

output: {
  path: path.join(__dirname, './dist'),
  filename: 'js/[name].[chunkhash].js'
}

```


我们在实际开发中可能需要按照其他指定html模板生成html, html-webpack-plugin插件提供我们传入参数解决其他需求
```

const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin') // 引入插件

module.exports = {
  mode: 'development',
  entry: {
    main: './src/script/main.js',
    a: './src/script/a.js',
    b: './src/script/b.js'
  },
  output: {
    path: path.join(__dirname, './dist/js'),
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'index.html', // template 指定html模板
      
      filename: 'index.html', // 指定生成的html文件名 也可以使用[hash].html 结合每次打包的hash值来作为文件名 或者[chunkhash]
      
      inject: 'body', // 指定在生成的index.html 中 在哪个标签内使用scirpt标签引入js
      
      title: 'this is title', // 在模板index.html中可以使用ejs语法去插入我们的title （webpack是支持ejs语法的）
      
      minify: { // 模板压缩配置
      
        removeComments: true, // 删除模板注释
      
        collapseWhitespace: true // 删除模板空格  还有很多参数可以按需配置
      
      },
      //chunks: ['main', 'a'], // 当你需要打包生成多个js文件时，该选项就可以决定是否都引入这些生成的js 这里的['main', 'a'] 就是entry中键值 
      我们执行打包时生成的html文件中只会引入index.js 和 a.js

      excludeChunks: ['b'], // 这行配置就是与chunks截然相反 配置它就是不引入chunk 为b也就是entry中键名为b的文件 也就是b.js
    })
  ]
}

```
（注意： 使用chunks参数去表示引入什么js，inject一定不能为false, 为false则什么js都不会引入）


我们这里存在几个问题: 
1. 我们的title如何在打包时在模板中获取并插入
2. 我们的inject参数选项只能指定一个标签用于放置script标签，我们如何在页面中的不同位置放置script标签？
3. 我们的有些脚本如何以内联的方式放入js代码而不是通过script引用？

解决方案： 在模板中使用ejs语法

首先打包时会在模板中注入一个htmlWebpackPlugin的对象，我们看看他到底存储了哪些信息
我们在模板文件中使用ejs语法遍历这个对象

```html

<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>template</title>
</head>
<body>

  <% for (let k in htmlWebpackPlugin) { %>
    <%= k %> : <%= JSON.stringify(htmlWebpackPlugin[k]) %>
  <% } %>

</body>
</html>

```
生成的大概的信息：
>files : {"publicPath":"","chunks":{"main":{"size":140,"entry":"js/main-17c43b1534d8b799f543.js","hash":"17c43b1534d8b799f543","css":[]},"a":{"size":140,"entry":"js/a-9f543b199f543534d8b7.js","hash":"17c43b1534d8b799f543","css":[]},"b":{"size":140,"entry":"js/b-d8b79b153b799f4d8543.js","hash":"17c43b1534d8b799f543","css":[]}},"js":["js/main-17c43b1534d8b799f543.js","js/a-9f543b199f543534d8b7.js","js/b-d8b79b153b799f4d8543.js"],"css":[]}
>options : {"template":"C:\\Users\\KEPING\\WebstormProjects\\webpack-study\\webpack-study-02\\node_modules\\_html-webpack-plugin@3.2.0@html-webpack-plugin\\lib\\loader.js!C:\\Users\\KEPING\\WebstormProjects\\webpack-study\\webpack-study-02\\index.html","filename":"a.[hash].html","hash":false,"inject":"body","compile":true,"favicon":false,"minify":false,"cache":true,"showErrors":true,"chunks":"all","excludeChunks":[],"chunksSortMode":"auto","meta":{},"title":"this is a.html","xhtml":false}

我们可以看到htmlWebpackPlugin对象中有两个属性 files options

* files 中存放的就是打包的信息
* options 就是我们实例化插件时传入的参数对象


接下来我们便可以从改对象中提取有用的信息

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><%= htmlWebpackPlugin.options.title %></title>
  <!-- 1. 将htmlWebapckPlugin实例化时的title注入到上面的占位符中 -->

  <script type="text/javascript">
    <%= compilation.assets[htmlWebpackPlugin.files.chunks.main.entry.substring(htmlWebpackPlugin.files.publicPath.length)].source() %>
  </script>
  <!-- 内联插入js  我们在生成打包后的js文件时会想模板中注入htmlWebpackPlugin的对象 它有options和files options就是我们实例化htmlWebpackPlugin传入的配置信息 files中存放的就是打包的信息 files中还存在chunks 而chunks中保存的就是所有的chunk chunk中又有entry打包后的文件路径-->
</head>
<body>

  <% for (let k in htmlWebpackPlugin.files.chunks) { %>
    <% if (k !== 'main') { %>
    <script src="<%= htmlWebpackPlugin.files.chunks[k].entry %>"></script>
    <% } %>
  <% } %>

  <!-- 这里就是遍历所有的chunk 当chunk != main的时候将用script标签将文件引入 -->

</body>
</html>

```
