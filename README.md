# express-gulp-browsersync

自动打包自动刷新 mock 环境

## 使用开发环境

* 下载所有文件

```
npm install
```

* 一键运行

```
gulp
```
* 首次运行请先进行强制打包

```
gulp fcompile
```

dist 文件夹下存放编译静态资源的源文件
public 文件夹下放编译后的文件

默认启动后打开 http://localhost:5000 如果网页没反应请尝试手动刷新一次，或访问 ttp://localhost:5000/html/index.html

如果接口占用，请在根目录下 gulpfile.js 文件中修改。

## 手动打包 dirt 文件夹下静态资源

* less 编译、压缩
	
	```
	gulp styles
	```
	
* js 压缩
	
	```
	gulp scripts
	```
	
	jshint 校验
	
	```
	gulp hint
	```
	
* ejs 模板编译
	
	```
	gulp ejs
	```
	
* images 图片压缩

	```
	gulp images
	```
	
* 手动清空打包后的静态资源 <span style="color:red">慎用</span>

	```
	gulp clean
	```
	
## 手动启动启动服务器并开启自动刷新

```
gulp browser-sync
```	

## 编写 mock 接口

在 router/index.js 中编写，或者在 router 文件夹内单独写 js 并且在 app.js 中引入。

