var gulp = require('gulp'), 
	//sass 暂时未增加
	sass = require('gulp-ruby-sass'),
    less = require('gulp-less'),
	LessAutoprefix = require('less-plugin-autoprefix'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefix = new LessAutoprefix({ browsers: ['>1%'],cascade: true}),
	rename = require('gulp-rename'),
	cssmin = require('gulp-minify-css'),
	notify = require('gulp-notify'),
	jsmin = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	del = require('del'),
	//只取变动的压缩
	cache = require('gulp-cache'),
	imagemin = require('gulp-imagemin'),
	ejs = require('gulp-ejs'),
	nodemon = require('gulp-nodemon'),
	browserSync = require('browser-sync').create(),
	runSequence = require('run-sequence'),
	revHash = require('gulp-rev-hash3');


/**
 *   编译输出地址 和 源地址
 *   * 匹配所有文件
 *   ** 匹配0个或多个文件夹
 *   ! 排除文件
 *   {} 匹配多个属性 src/{a,b}.js
 */
var path = {
	"dist":"public",
	"src": "src",
};
path.styles = (function() {
    return {
    	"src":{
    		"less": [path.src+"/less/**/*.less","!"+path.src+"/less/utils.less"],
    		"css": path.src+"/css/*.css",
    	},
    	"dist":path.dist+"/css"    	
    };
})();
path.fonts = (function(){
	return {
    	"src": path.src+"/fonts/*",
    	"dist": path.dist+"/fonts"
	}
})();
path.scripts = (function() {
	return {
		"src":path.src+"/js/**/*.js",
		"dist":path.dist+"/js"
	};
})();
path.html = (function() {
	return {
		"src":path.src+"/html/*.ejs",
		"dist":path.dist+"/html"
	};
})();
path.images = (function() {
	return {
		"src":path.src+"/images/**/*",		
		"dist":path.dist+"/images/"
	};
})();

//监控文件改动 刷新浏览器
gulp.task('browser-sync', ['server'],function () {
	// 不能用 loalhost
	return browserSync.init({
		proxy: 'http://127.0.0.1:3000',
		files: [path.dist+'/**/*.*'],
		browser: "/Applications/Google Chrome.app",
		// Windows 下用 Chrome 打开
		// browser: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
		port: 5000
	});
    // browserSync({
    // 	files: ["public/*/*.*"],
    //     server: {
    //       baseDir: './public',
    //       browser: "google chrome"        
    //    } 
    // });	
});

// 编译压缩Less
gulp.task('styles',function(){
	gulp.src(path.styles.src.css)
		.pipe(cssmin())
	    .pipe(gulp.dest(path.styles.dist));	
	gulp.src(path.fonts.src)
	    .pipe(gulp.dest(path.fonts.dist));
	return gulp.src(path.styles.src.less)
	.pipe(sourcemaps.init()) // 执行sourcemaps
	.pipe(less({
		plugins: [autoprefix]
	}).on('error', notify.onError(function (error) {
            return 'Error compiling LESS: ' + error.message;
    	}))
	)
    // .pipe(gulp.dest('dist/css'))
	.pipe(rename({suffix:".min"}))
	.pipe(cssmin())
	.pipe(sourcemaps.write())  
    .pipe(gulp.dest(path.styles.dist))
    .pipe(notify({ message: 'Styles task complete' })); 
});
gulp.task('styles-dev',function(){
	gulp.src(path.styles.src.css)
	    .pipe(gulp.dest(path.styles.dist));	
	gulp.src(path.fonts.src)
	    .pipe(gulp.dest(path.fonts.dist));
	return gulp.src(path.styles.src.less)
	.pipe(sourcemaps.init()) // 执行sourcemaps
	.pipe(less({
		plugins: [autoprefix]
	}).on('error', notify.onError(function (error) {
            return 'Error compiling LESS: ' + error.message;
    	}))
	)
	.pipe(rename({suffix:".min"}))
	.pipe(sourcemaps.write())  
    .pipe(gulp.dest(path.styles.dist))
    .pipe(notify({ message: 'Styles task complete' })); 
});

// 压缩 js
gulp.task('scripts', function() {
    return gulp.src(path.scripts.src)
    	.pipe(rename({suffix:".min"}))
        .pipe(jsmin())
        .pipe(gulp.dest(path.scripts.dist))
        .pipe(notify({message: "Scripts task complete"}));
});
// 开发环境
gulp.task('scripts-dev', function() {
    return gulp.src(path.scripts.src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
	    .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest(path.scripts.dist))
        .pipe(notify({message: "Scripts-dev task complete"}));
});

// js语法检查
gulp.task('jshint', function() {
    return gulp.src(path.scripts.src)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

// 编译 ejs
gulp.task('ejs',function() {
	return gulp.src(path.html.src)
	.pipe(ejs({},{ext:'.html'}))
	.pipe(gulp.dest(path.html.dist))
	.pipe(notify({message: "ejs task complete"}));
});
//开发环境 只是搬运 html
gulp.task('html-dev',function() {
	return gulp.src(path.src+"/html/**/*.html")
	.pipe(gulp.dest(path.html.dist))
	.pipe(notify({message: "html-dev task complete"}));
});

// 压缩图片
gulp.task('images', function() {  
  return gulp.src(path.images.src)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(path.images.dist))
    .pipe(notify({ message: 'Images task complete'}));
});
//开发环境
gulp.task('images-dev', function() {  
  return gulp.src(path.images.src)
    .pipe(gulp.dest(path.images.dist))
    .pipe(notify({ message: 'Images-dev task complete'}));
});

gulp.task('revHtml', function () {
    return gulp.src(path.html.dist+'/*.html')
        .pipe(revHash({
        	assetsDir: path.dist,
        	projectPath: './'
        }))
        .pipe(gulp.dest(path.html.dist));
});

// 启动服务器
gulp.task('server',function(cb) {
	// return nodemon({
	// 		script : 'bin/www',  
	// 		ext: 'js html',  
	// 		env: {  
	// 		    "NODE_ENV": "development"  
	// 		}  
	// 	});	
	var started = false;

	nodemon({
		script: 'bin/www'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});		
});

// 监控静态资源处理
gulp.task('watch-production', function () {
	gulp.start('styles','scripts','images','html-dev','ejs');
    gulp.watch(path.styles.src.less, ['styles']); 
    gulp.watch(path.scripts.src,['scripts']);
    gulp.watch(path.images.src,['images']);
    gulp.watch(path.html.src,['ejs']);
});
gulp.task('watch-dev',function() {
	gulp.start('styles-dev','scripts-dev','images-dev','ejs','html-dev');
	gulp.watch(path.styles.src.less, ['styles-dev']); 
	gulp.watch(path.scripts.src,['scripts-dev']);
	gulp.watch(path.images.src,['images-dev']);
	gulp.watch(path.src+'/html/**/*.html',['html-dev']);
    gulp.watch(path.html.src,['ejs']);
});

// 初始化 init
gulp.task('lib-init',function(){
	var jslibs = [
			"bower_components/bootstrap/dist/js/bootstrap.min.js",
			"bower_components/jquery/dist/jquery.min.js"],
		csslibs = [
			"bower_components/bootstrap/dist/css/bootstrap.min.css"
			];
	gulp.src(jslibs)
	.pipe(gulp.dest(path.dist+"/lib/js/"));	
	gulp.src(csslibs)
	.pipe(gulp.dest(path.dist+"/lib/css/"));
});

// 清理
gulp.task('clean', function() {
    return del(path.dist+'/**/*');
});

// 强制文件打包
gulp.task('fcompile',function(callback) {
	// gulp.start('lib-init','styles','scripts','images','ejs','revHtml');
	runSequence('clean',['lib-init','styles','scripts','images','ejs'],'revHtml',callback);
});

// 默认任务 开发环境
gulp.task('default',['watch-dev','browser-sync']); //定义默认任务
// 生产环境
gulp.task('production',['watch-production','browser-sync']); 
