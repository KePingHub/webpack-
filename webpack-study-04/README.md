# webpack配置处理模板，图片的loader

# 一. 处理模板文件
1. 处理.html模板文件，安装html-loader:
> npm install html-loader -D

在webpack.config.js中的module的rules添加一项处理.html文件的rule
```javascript
{
  test: /\.html$/,
  loader: 'html-loader'
}
```
html-loader主要将html文件的内容转成字符串输出

这是用于处理简单的模板，倘若需要在模板中动态加入标签或者内容，html-loader便满足不了需求，这时便可以使用一些其他模板loader
2. 使用ejs-loader，安装ejsj-loader：
> npm install ejs-loader -D

添加一条rule
```javascript
{
  test: /\.ejs$/,
  loader: 'ejs-loader'
}
```
这时候我们新建一个layer.ejs的模板文件
```html
<div></div>
```
在这个文件中我们可以使用ejs语法动态生成标签或者其他内容
既然是动态生成，我们就必须得传入一些我们需要的数据，如何传递, 以及如何在模板中获取？
因为ejs-loader处理过模板文件会生成一个函数，我们在打印一下这个函数：
在layer.js中引入这个模板文件：
> import ejsTpl from './layer.ejs'
> console.log(ejsTpl)

结果：
```javascript
ƒ (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div></div>';

}
return __p
}
```
我们看到在layer.js中导进来的是一个函数，我们看到参数是一个对象，返回的是一个html字符串。我们可以把模板想要的数据通过对象传递进去
在layer.js文件中导入ejs文件并导出一个对象，
```javascript
import ejsTpl from './layer.ejs'

export default {
  msg: 'this is layer.js',
  ejsTpl: ejsTpl
}
```
在主文件app.js中引入layer.js并使用该模板，我们使用了id为app的div，所以现在template中加入<div id="app"></div>标签，
```javascript
import layer from './components/layer/layer.js'
const App = function () {
  const app = document.getElementById('app')
  app.innerHTML = layer.ejsTpl({
    layer
  })
}

new App()
```
我们这里传入了layer这个从layer.js导进来对象，如何在ejs中使用？
```ejs
<div>
    <span><%= layer.msg %></span>
    <% for (let key in layer) { %>
        <%= key %> : <%= JSON.stringify(layer[key]) %>
    <% } %>
</div>
```

可以在模板文件中使用ejs语法动态生成自己所需内容

2. 处理图片文件例如png，jpg，svg等等
我们在a.less文件中加入样式background: url("../../assets/bg.jpg");

打包后发现报错： 没找到loader去处理jpg这个文件类型.

安装 file-loader:
> npm install file-loader -D

加一条rule：
```javascript
{
  test: /\.(jpg|png|svg|gif)$/,
  loader: 'file-loader',
  options: {
    name: 'assets/[name]-[hash].[ext]' // [name] 图片原始名字 [hash] 打包生成的hash [ext] 图片拓展名 'assets/'打包后的图片文件放在dist/assets目录下，如果dist下没有assets目录则会打包时生成
  }
}
```
再次打包发现图片已经在dist目录下生成bg-asasdfasd234fsdf.jpg文件 而且我们用浏览器打开打包后的html文件发现图片正常显示
我们分别在template.html，layer.ejs文件中加入img标签

template.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>webpack app</title>
</head>
<body>
  <img src="./src/assets/bg.jpg" alt="">
  <div id="app"></div>
</body>
</html>
```
layer.ejs
```ejs
<div>
    <img src="../../assets/bg.jpg" alt="">
    <span><%= layer.msg %></span>
    <% for (let key in layer) { %>
        <%= key %> : <%= JSON.stringify(layer[key]) %>
    <% } %>
</div>
```
打包后浏览器打开打包后的html文件发现通过ejs-loader并没有处理img标签
怎么办，换一种方式引入图片

layer.ejs
```ejs
<div>
    <img src="${ require("../../assets/bg.jpg") }" alt="">
    <span><%= layer.msg %></span>
    <% for (let key in layer) { %>
        <%= key %> : <%= JSON.stringify(layer[key]) %>
    <% } %>
</div>
```
再次打包发现已经ok了

还有一种可以处理图片的loader，url-loader
安装url-loader
> npm install url-loader -D

将上面的配置的处理图片的loader改成url-loader
```javascript
{
  test: /\.(jpg|png|svg|gif)$/,
  loader: 'url-loader',
  options: {
    limit: 20000, // url-loader 限制处理20k以内的图片转成base64 这种方式会加大js和使用img标签的html文件大小 超过20k则会自动使用file-loader处理
    name: 'assets/[name]-[hash].[ext]' // [name] 图片原始名字 [hash] 打包生成的hash [ext] 图片拓展名
  }
}
```