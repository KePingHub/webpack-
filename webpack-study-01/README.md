# webpack4.x开发环境的配置

## 1. 全局安装webpack
旧版本的安装方式，直接使用npm全局安装webpack，预期安装webpack后，便能直接在命令行中使用webpack指令。我们在命令行中输入以下指令并回车运行：

> npm install -g webpack

## 2. 创建项目
我们在合适位置创建一个文件夹webpack-test用于存放我们的项目。在命令行中定位到webpack-test文件夹下。或者直接通过图形界面进入到当前文件夹下（windows使用shift+右键 在弹出的对话框中选择 在此处打开命令窗口）（mac 直接将文件夹目录拖到命令行即可）输入以下命令进行项目的初始化：

> npm init

运行后会有很多设置选项，可以根据自己的需求配置也可以直接一路回车跳过。完成后，我们的文件夹下会增加 package.json 文件，它用于保存项目的信息，例如项目的依赖等等。

## 3. 尝试打包出现提示信息
我们在项目根目录创建hello.js文件, 并在其中输入代码：

```
function hello() {
    alert('hello');
}

```
然后我们便尝试打包，在命令行输入：

> wepback hello.js hello.bundle.js

这行命令是将hello.js打包成另一个文件bundle.js,不幸的是

:   提示webpack不是内部命令

这时候我们在项目里安装webpack：

> npm install webpack -D

:   这里的-D参数其实就是--save-dev的简写，-D是将安装的依赖信息保存到package.json中的devDependencies 中.

再次尝试打包,Unfortunately，4.x版本会提示：
> The CLI moved into a separate package:webpack-cli.
> Please install 'webpack-cli' in addition to webpack itself to use the CLI.
> ->when using npm: npm install webpack-cli -D
> ->when using yarn: yarn add webpack-cli -D

翻译成中文的意思是:
> CLI（命令行工具）已经转移到了一个单独的包webpack-cli中。 
> 除了webpack自身外，请额外安装webpack-cli来使用CLI。
> -> 使用npm安装：npm install webpack-cli -D 
> ->使用yarn安装：yarn add webpack-cli -D
意思就是我们需要安装webpack-cli, 否则就不能再命令行中运行webpack的相关命令.

## 4. 安装webpack-cli

我们在项目中安装webpack-cli:

> npm install webpack-cli -D


## 5. 设置模式

我们再一次的尝试打包:

> wepback hello.js hello.bundle.js

似乎可以执行命令了， 但是出现了新的提示：
> WARNING in configuration
> The 'mode' option has not been set. Set  'mode' option to 'development' or 'production' to enable defaults for this enviroment.
> ERROR in multi ./hello.js bundle.js
> Module not found:ERROR:Can't resolve 'bundle.js' in 'C:/Users/你的用户名/Desktop/webpack-test'
> @ multi ./hello.js bundle.js

译：
> 配置警告： 
> “mode”选项尚未设置。将“mode”选项设为“development”或“production”以启用此环境的默认设置。

> multi错误 ./ hello.js bundle.js

> 未发现模块：错误：无法解析’C:/Users/你的用户名/Desktop/webpack-test’中的bundle.js

> @ multi ./hello.js bundle.js

这提示的警告信息“mode”选项没有配置， 默认有production和development两种模式可以设置,因此我们尝试设为development模式，键入命令：

> webpack --mode development

我们看到进行了打包并显示了Hash、Version、Time、Build at信息，表明已经可以打包。不过，仍然有错误提示：

> ERROR in Entry module not found:ERROR:Can't resolve './src' in 'C:/Users/你的用户名/Desktop/webpack-test
译：
> 未找到入口模块发生错误：错误：无法解析’C:/Users/你的用户名/Desktop/webpack-test’中的’./src’

## 6. 创建入口文件
上面的error是为什么呢？
原因就是webpack4.x版本是根据项目根目录下的‘./src/index.js’作为入口文件,但是我们的项目中并没有带有index.js的src文件夹，所以我们在根目录新建 src 文件夹，并将hello.js文件移入src文件夹并重命名为index.js

现在我们再次执行

> webpack index.js bundle.js

会提示can't resolve相关的错误.

原因是，webpack4.x的打包已经不能用webpack 文件a 文件b的方式，而是直接运行webpack --mode development或者webpack --mode production，这样便会默认进行打包，入口文件是'./src/index.js'，输出路径是'./dist/main.js'，其中src目录即index.js文件需要手动创建，而dist目录及main.js会自动生成。
因此我们不再按webpack 文件a 文件b的方式运行webpack指令，而是直接运行

> webpack --mode development
或者
> webpack --mode production

这样便可以将'./src/index.js'打包成'./dist/main.js'

## 7. 如何处理css文件

我们在项目中引入style.css文件
执行以下命令：

> webpack --mode development

提示错误：

> ERROR in ./src/style.css
> Module parse failed: Unexpected token (1:5)
> You may need an appropriate loader to handle this file type.

译：
> 打包时在'./src/style.css'文件中发生错误
> 模块解析错误: 意外的标记
> 您可能需要一个合适的加载器来处理这个文件类型

原因是什么呢?
:  就是因为webpack默认是处理不了.css文件类型的，想要处理css文件必须使用css-loader

安装css-loader

> npm insatll css-loader -D

如何使用css-loader呢

我们可以在引入style.css文件的时候在路径前加上'css-loader!',具体如下：

```javascript
require('css-loader!./style.css') // 这就代表打包时使用css-loader处理style.css文件

```
运行：
> webpack --mode development

打包成功

我们在根目录新建index.html,并用script标签引入dist目录下的main.js用于查看效果,

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>webpack-test</title>
</head>
<body>
  <script src="../dist/main.js"></script>
</body>
</html>

``` 

出乎意料的是样式都没有，解决方法是配合style-loader就能解决，
我们安装style-loader,执行以下命令:
> npm install style-loader -D

然后我们在引入的css文件的路径中加入'style-loader!'

```javascript
require('style-loader!css-loader!./style.css') 

/** 
 * 这就代表打包时使用css-loader处理style.css文件,
 * 再通过style-loader处理css-loader处理过的文件
 *
 * style-loader 就是将css-loader处理后生成的代码
 * 通过style标签包裹并插入到html中
 */

```
再执行打包命令:

> webpack --mode development

打包成功, 通过浏览器打开index.html 发现效果出来了

我们发现每次在引入css文件的时候还要在目录前加上'style-loader!css-loader!'太麻烦
所以我们直接在命令行中输入：
> webpack --mode development --module-bind "css=style-loader!css-loader"
--module-bind 就是为文件绑定loader

我们可以发现这种方式同
```javascript
require('style-loader!css-loader!./style.css')

```
的效果一模一样

但是我们发现每次修改都要打包一次，我们能不能当代码改变的时候自动去打包呢?

答案肯定是yes

我们可以使用--watch
执行命令:
> webpack --mode development --module-bind "css=style-loader!css-loader" --watch

我们发现打包成功后它并没有停止运行
我们尝试修改index.js文件, 发现代码重新打包了

并且我们还有其他的参数
例如：

> --progress 显示打包的过程
> --display-reasons 显示模块打包的原因
> --display-modules 显示打包的模块信息

还有其他的参数我们可以通过命令:
> webpack --help 查看其他的参数以及作用

到现在为止，我们的命令依旧是太过麻烦, 命令太长了,
我们可以直接在package.json文件中的scripts中加入两项：

> "dev":"webpack --mode development --module-bind css=style-loader!css-loader",
> "build":"webpack --mode production --module-bind css=style-loader!css-loader"

然后我们只需要执行 npm run dev 便相当于执行 webpack --mode development，npm run build 亦是如此.

我们在命令行中执行:

> npm run dev

完成后我们便可以清楚的看到项目的根目录下生成了dist目录,并在其生成了打包后的 main.js 文件

我们在浏览器运行index.html文件发现css样式也生效了
