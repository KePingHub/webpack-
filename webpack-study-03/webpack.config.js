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
          /*{
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({  // 增加css浏览器前缀
                  browsers: ['last 5 versions']
                })
              ]
            }
          }*/
          'postcss-loader'
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader', // 为何这里不加options: { importLoaders: 1 } 是因为less已经将@import的内容已经处理了，所以当postcss-loader处理的时候也就没有@import
          /*{
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({  // 增加css浏览器前缀
                  browsers: ['last 5 versions']
                })
              ]
            }
          },*/ // postcss-loader的配置重复了，可以使用配置postcss.config.js文件的方式去配置postcss-loader启用插件
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
