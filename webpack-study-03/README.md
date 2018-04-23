# webpack 使用loader处理module
## 在配置文件中加入module项
这个module里面就是为不同文件配置不同loader去预处理文件

### 1. 配置处理js文件的babel-loader
首先安装babel-loader babel-core babel-preset-env
> npm install babel-core babel-loader babel-preset-env -D
* babel-core
    
    babel-core 的作用是把 js 代码分析成 ast（抽象语法树） ，方便各个插件分析语法
    进行相应的处理。有些新语法在低版本 js 中是不存在的，如箭头函数，函数默认值等，
    这种语言层面的不兼容只能通过将代码转为 ast，分析其语法后再转为低版本 js。
* babel-loader
    
    调用babel-core中的转译api进行转译
* babel-preset-env
    
    因为在转译过程中要使用各类插件，babel官方提供了一些预设的插件集，称为preset，
    这样就不需要我们自行配置了，直接使用对应的preset就ok，以JS标准为例，babel提供
    了如下的一些preset：
    * es2015  （弃用）
    * es2016  （弃用）
    * es2017  （弃用）
    * latest （弃用）
    * env （相当于es2015,es2016,es2017以及latest最新版本）
```javascript
1.在webpack.config.js中配置

const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "js/[name]-[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 正则匹配js文件
        exclude: '/node_modules', // （必须绝对路径）忽略node_modules文件夹下的所有文件因为这个文件夹下的npm包不需要转译
        include: '/src/', // （必须绝对路径）只包含src下的所有文件 也可以使用数组包含多个路径
        loader: 'babel-loader' // 使用的loader
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'template.html',2
      filename: 'index.html',
      title: 'this is title',
      inject: 'body',
      minify: {
        removeComments: true
      }
    })
  ]
}
```
2. 启用插件

    虽然已经配置好了babel但是打包发现并没有生效,我们有几种启用方式
    
    * 我们在项目的根目录创建.babelrc配置文件

    > { "presets": ["env"] }
    * 我们在package.json中加入键值对
    > "babel": {
          "presets": ["env"]
        }
    * 我们在webpack.config.js中
    ```javascript 
    rules: [
          {
            test: /\.js$/, // 正则匹配js文件
            exclude: '/node_modules/', // 忽略node_modules文件夹下的所有文件（必须绝对路径）也可以使用数组包含多个路径  因为这个文件夹下的npm包不需要转译
            include: '/src/', // 只包含src下的所有文件 （必须绝对路径）也可以使用数组包含多个路径
            loader: 'babel-loader' // 使用的loader
            query: {
              presets: ['env']
            }
          }
        ]
    ```
### 2. 配置处理css的loader

1. 使用postcss-loader处理给css添加浏览器前缀
> npm install style-loader css-loader postcss-loader autoprefixer -D
```javascript
  {
    test: /\.css$/,
    use: [  // 当我们需要同时对一种文件使用多个loader并且loader可能需要传入一些参数时，可以使用use: [] loader时从后往前依次处理
      'style-loader',
      { loader: 'css-loader', options: { importLoaders: 1 } }, // options就是参数 如果css文件使用了@import语法引入css打包后并不会经过postcss-loader importLoaders=1就是在指定css-loader处理后指定1个loader处理import进来的css因为我们后面只有一个postcss-loader所以css-loader处理完就会经过postcss-loader处理import进来的css
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [  // 给postcss-loader配置插件 自行按需配置
            require('autoprefixer')({  // 增加css浏览器前缀
              browsers: ['last 5 versions'] // 插件的参数 最新5个版本的浏览器
            })
          ]
        }
      }
    ],
  }
```
2. 处理less文件

安装less-loader less：
> npm install less-loader less -D

安装less是因为less-loader需要less作为同版本依赖，这样便能更精准的控制版本

使用less-loader
```javascript
  {
    test: /\.less$/,
    use: [
      'style-loader',
      'css-loader', // 为何这里不加options: { importLoaders: 1 } 是因为less已经将@import的内容已经处理了，所以当postcss-loader处理的时候也就没有@import
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [
            require('autoprefixer')({  // 增加css浏览器前缀
              browsers: ['last 5 versions']
            })
          ]
        }
      },
      'less-loader'
    ]
  }
```

我们发现我们有一部分的配置重复了也就是postcss-loader部分的配置重复了，我们可以在项目的根目录下新建postcss.config.js将postcss-loader的配置写到这个文件中
```javascript
module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['last 5 versions']
    })
  ]
}
```

然后我们更改webpack.config.js
```javascript
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "js/[name]-[chunkhash].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/, //匹配js文件
        loader: 'babel-loader', //配置loader
        exclude: '/node_modules/', // 排除node_modules文件夹(绝对路径) 也可以使用数组包含多个路径
        include: '/src/' // 排除src目录以外的所有文件夹（绝对路径）也可以使用数组包含多个路径
      //   query: {
      //     presets: ['env']  // 配置插件集 env 为js最新插件集包含es2015 es2016 es2017 latest 也可以通过配置.babelrc文件启用 还可以通过package.json 添加"babel": {"presets": ["env"]}
      //   }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } }, // options就是参数 如果css文件使用了@import语法引入css打包后并不会经过postcss-loader importLoaders=1就是在指定css-loader处理后指定1个loader处理import进来的css因为我们后面只有一个postcss-loader所以css-loader处理完就会经过postcss-loader处理import进来的css
          'postcss-loader'
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          // 'postcss-loader', // 默认postcss-loader默认会载入根目录下的postcss.config.js文件的配置
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, './postcss.config.js') // 当你需要不同的配置文件配置postcss-loader时可以通过config参数下的path指定配置文件的路径
              }
            }
          },
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'template.html',
      filename: 'index.html',
      title: 'this is title',
      inject: 'body',
      minify: {
        removeComments: true
      }
    })
  ]
}

```
ps: 学着学着就发现要学的东西越来越多，无限延伸，也越发觉得webapck太强大了，真的可怕，想学的东西太多了， 而要学的东西更是多。总之继续努力