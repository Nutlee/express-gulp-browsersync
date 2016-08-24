# express-gulp-browsersync

自动打包自动刷新 mock 环境

## 使用环境

开发环境

* 下载所有文件

```
npm install
```

* 一键运行

```
gulp
```

生产环境

* 首次运行请先进行强制打包

```
gulp fcompile
```
* 一键运行

```
gulp production
```

dist 文件夹下存放编译静态资源的源文件
public 文件夹下放编译后的文件

开发环境下只会进行 less 编译和从开发文件夹拷贝其他静态文件到发布为止（public）下。

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
	gulp jshint
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
	
	注：
	使用 命令后加 -dev 进行开发环境部署，如 
	
	```
	# 开发环境仅仅编译 less
	gulp styles-dev 
	```
	
## 手动启动服务器并开启浏览器自动刷新

```
gulp browser-sync
```	

## 编写 mock 接口

在 router/index.js 中编写，或者在 router 文件夹内单独写 js 并且在 app.js 中引入。

