# express-gulp-browsersync

自动打包自动刷新 mock 环境

20161024 更新

* 增加 MIT license
* 更新了部分包版本
* 优化了部分代码

程序猿节，快乐❤️，正在修改一个 webpack 的方案，更加炫酷奥。

20160917 更新

* 修正 images 压缩路径错误
* 将 public 文件夹加入到 gitignore 中

20160907 更新

* 梳理文件结构和 gulpfile.js 中引用的路径，现在用一个 path 对象来描述路径结构
* 默认是自动打开 Mac 下 Chrome，注释了一行 PC 下打开 Chrome 的，请自行修改 gulpfile.js 下 browser-sync 这个 task 感谢[@CarnivalO](https://github.com/CarnivalO)
* 优化和删减了部分代码

20160905 更新

* 增加 bower 代理设置
* Bootstrap 默认依赖的 jQuery 是 1.11.1 ，调整原来是使用的 2.14

20160828 更新

* 加入 lib-init，将前端依赖库核心文件倒入到 public 文件夹中。

20160825 更新

* 使用 mock.js 模拟接口数据 

20160824 更新

* 增加 bower 前端依赖管理
* 根目录下 .jshintrc 文件配置 jshint 校验选项
* 增加 jade 编译，但主要还是用 ejs，提供 ejs 复用头尾 demo


## 使用环境

1. 开发环境

	* 下载所有文件
	
	```
	npm install
	```

	* 一键运行
		
	```
	gulp
	```

2. 生产环境

	* 首次运行请先进行强制打包
	
	```
	gulp fcompile
	```

	* 一键运行
	
	```
	gulp production
	```

3. 前端依赖

	初始化静态依赖 （已配置 bower.json 包含 jQuery 和 Bootstrap）
	
	```
	bower install
	```

	在 gulpfile.js 中配置好需输出到 public 的前端依赖库核心文件，执行
	
	```
	gulp lib-init
	```

4. 文件说明

	**src** 文件夹下存放编译静态资源的源文件
	**public** 文件夹下放编译后的文件
	
	开发环境下只会进行 less 编译和从开发文件夹拷贝其他静态文件到发布为止（public）下。
	
	默认启动后打开 
	
	```
	http://localhost:5000 
	```

	如果网页没反应请尝试手动刷新一次，或访问 
	
	```
	http://localhost:5000/html/index.html
	```

	如果接口占用，请在根目录下 gulpfile.js 文件中修改。


## 手动打包 src 文件夹下静态资源

* less 编译、压缩
	
	```
	gulp styles
	```
	
* js 压缩
	
	```
	gulp scripts
	```
	
* jshint 校验
	
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

在 router/index.js 中编写，或者在 router 文件夹内单独写 js 并且在 App.js 中引入。

使用 mock.js 产生随机数据，如

```
router.route('/test')
	.get(function(req,res,next) {
		var data = mock.mock({
		    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
		    'list|1-10': [{
		        // 属性 id 是一个自增数，起始值为 1，每次增 1
		        'id|+1': 1
		    }]
		});
		res.send(data);
	})
```

更多例子请查看[官网](http://mockjs.com/)。

## 前端库安装

使用 bower 来管理前端库依赖，默认的依赖库下载到 bower_components 下。

* 初始化 bower （当前项目已初始化）

	```
	bower init
	```
	
* 根据 bower.json 安装

	```
	bower install
	```

* 安装前端库并保存到 bower.json 

	```
	# jQuery 2.1.4
	bower install git@github.com:jquery/jquery.git#2.1.4 --save
	# Bootstrap 3.3.7
	bower install git@github.com:twbs/bootstrap.git#3.3.7 --save
	```
* 将库核心文件输出到 public 文件夹下，需在根目录下 gulpfile.js 中手动配置输出的内容

	```
	gulp lib-init
	```
	
* 卸载并从 bower.json 中删除
	
	```
	bower uninstall jquery --save
	```

* bower 配置 http/https 代理
	
	* 在用户更目录或者项目根目录下创建 .bowerrc 文件
	* 添加内容

	```
	{
  		"proxy": "http://127.0.0.1:8888",
  		"https-proxy": "http://127.0.0.1:8888"
	}
	```


