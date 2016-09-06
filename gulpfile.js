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
	jade = require('gulp-jade'),
	nodemon = require('gulp-nodemon'),
	browserSync = require('browser-sync').create();

// 编译输出地址 和 源地址
var compileOutDir = 'public',
	sourceDir = 'src';

var path = {
	"dist":"public",
	"src": "src"
}
path.styles = (function() {
    return {
      "src":[path.src+"/less/*.less","!"+path.src+"/less/utils.less"],
      "dist":path.dist+"/css"
    }
})();
path.scripts = (function() {
	return {
		"src":path.src+"/js",
		"dist":path.dist+"/js"
	}
})();
path.html = (function() {
	return {
		"src":path.src+"/html",
		"dist":path.dist+"/html"
	}
})();
path.images = (function() {
	return {
		"src":path.src+"/images/**/*",		
		"dist":path.dist+"/images/**/*"
	}
})();


// 编译压缩Less
gulp.task('styles',function(){
	return gulp.src(path.styles.src)
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
	return gulp.src(path.styles.src)
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
    return gulp.src(path.scripts.src+'/*.js')
    	.pipe(rename({suffix:".min"}))
        .pipe(jsmin())
        .pipe(gulp.dest(path.scripts.dist))
        .pipe(notify({message: "Scripts task complete"}));
});
// 开发环境
gulp.task('scripts-dev', function() {
    return gulp.src(path.scripts.src+'/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
	    .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest(path.scripts.dist))
        .pipe(notify({message: "Scripts task complete"}));
});

// js语法检查
gulp.task('jshint', function() {
    return gulp.src(path.scripts.src+'/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

// 编译 ejs
gulp.task('ejs',function() {
	return gulp.src(sourceDir+"/html/*.ejs")
	.pipe(ejs({},{ext:'.html'}))
	.pipe(gulp.dest(compileOutDir+'/html/'))
	.pipe(notify({message: "ejs task complete"}));
});
//开发环境
gulp.task('html-dev',function() {
	return gulp.src(sourceDir+"/html/*.html")
	.pipe(gulp.dest(compileOutDir+'/html/'))
	.pipe(notify({message: "html task complete"}));
});

// 编译jade
gulp.task('jade',function() {
	return gulp.src(sourceDir+'/html/*.jade')
		.pipe(jade({
			pretty:true
		}))
		.pipe(gulp.dest(compileOutDir+'/html/'))
		.pipe(notify({message: "jade task complete"}));
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
    .pipe(notify({ message: 'Images task complete'}));
});

// 启动服务器
gulp.task('serve',function(cb) {
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

//监控文件改动 刷新浏览器
gulp.task('browser-sync', ['serve'],function () {
	// 不能用 loalhost
	return browserSync.init({
		proxy: 'http://127.0.0.1:3000',
		files: [compileOutDir+'/*/*.*'],
		browser: "google chrome",
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

// 监控静态资源处理
gulp.task('watch-production', function () {
    gulp.watch(sourceDir+'/less/*.less', ['styles']); //当所有less文件发生改变时，调用styles任务
    gulp.watch(sourceDir+'/js/*.js',['scripts']);
    gulp.watch(sourceDir+'/images/*',['images']);
    gulp.watch(sourceDir+'/html/*.ejs',['ejs']);
});
gulp.task('watch-dev',function() {
	gulp.start('styles-dev','scripts-dev','images-dev','html-dev');
	gulp.watch(sourceDir+'/less/*.less', ['styles-dev']); //当所有less文件发生改变时，调用styles任务
	gulp.watch(sourceDir+'/js/*.js',['scripts-dev']);
	gulp.watch(sourceDir+'/images/*',['images-dev']);
	gulp.watch(sourceDir+'/html/*.html',['html-dev']);
    // gulp.watch(sourceDir+'/html/*.jade',['jade']);
    gulp.watch(sourceDir+'/html/*.ejs',['ejs']);
})

// 初始化 init
gulp.task('lib-init',function(){
	var jslibs = [
			"bower_components/bootstrap/dist/js/bootstrap.min.js",
			"bower_components/jquery/dist/jquery.min.js"],
		csslibs = [
			"bower_components/bootstrap/dist/css/bootstrap.min.css"
			];
	gulp.src(jslibs)
	.pipe(gulp.dest(compileOutDir+"/lib/js/"));	
	gulp.src(csslibs)
	.pipe(gulp.dest(compileOutDir+"/lib/css/"));
});

// 清理
gulp.task('clean', function() {
    del([compileOutDir+'/css/*']);
    del([compileOutDir+'/js/*']);
    // del([compileOutDir+'/ejs/*']);
    del([compileOutDir+'/images/*']);
});

// 强制文件打包
gulp.task('fcompile',['clean'],function() {
	gulp.start('styles','scripts','images','ejs');
});

// 默认任务 开发环境
gulp.task('default',['browser-sync','watch-dev']); //定义默认任务
// 生产环境
gulp.task('production',['browser-sync','watch-production']); 
