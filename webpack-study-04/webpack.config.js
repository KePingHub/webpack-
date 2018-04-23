const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
        include: '/src/',
        options: {
          presets: ['env'],
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            // options: {
            //   config: {
            //     path: path.resolve(__dirname, './postcss.config.js')
            //   }
            // }
          },
          'less-loader'
        ]
      },
      // {
      //   test: /\.(jpg|png|gif|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name]-[hash].[ext]', // [ext]拓展名
      //   }
      // },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 200000, // 限制200k 超过200k就会自动调用file-loader处理 经url-loader处理的转为base64编码会加大打包后的js和html的文件大小
          name: 'assets/[name]-[hash].[ext]', // [ext]拓展名 assets/指定打包后的存放打包文件的文件夹为assets 经url-loader打包成base64则不会生成assets文件夹
        }
      }
    ]
  },
  devtool: 'sourceMap',
  plugins: [
    new htmlWebpackPlugin({
      template: 'template.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['main'],
      minify: {
        removeComments: true,
      }
    })
  ]
}

module.exports = config