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
	browserSync = require('browser-sync').create();

// 源地址 和 编译资源后地址
var compileOutDir = 'public',
	sourceDir = 'dist';

// 编译压缩Less
gulp.task('styles',function(){
	return gulp.src(sourceDir+'/less/*.less')
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
	.pipe(sourcemaps.write())  // 执行sourcemaps
    .pipe(gulp.dest(compileOutDir+'/css'))
    .pipe(notify({ message: 'Styles task complete' })); //将会在src/css下生成index.css
});

// 压缩 js
gulp.task('scripts', function() {
    return gulp.src(sourceDir+'/js/*.js')
    	.pipe(rename({suffix:".min"}))
        .pipe(jsmin())
        .pipe(gulp.dest(compileOutDir+'/js'))
        .pipe(notify({message: "Scripts task complete"}));
});

// js语法检查
gulp.task('jshint', function() {
    return gulp.src(sourceDir+'/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 编译 ejs
gulp.task('ejs',function() {
	return gulp.src(sourceDir+"/templates/*.ejs")
	.pipe(ejs({},{ext:'.html'}))
	.pipe(gulp.dest(compileOutDir+'/html/'))
	.pipe(notify({message: "ejs task complete"}));
});

// 压缩图片
gulp.task('images', function() {  
  return gulp.src(sourceDir+'/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(compileOutDir+'/images'))
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
gulp.task('watch', function () {
    gulp.watch(sourceDir+'/less/*.less', ['styles']); //当所有less文件发生改变时，调用styles任务
    gulp.watch(sourceDir+'/js/*.js',['scripts']);
    gulp.watch(sourceDir+'/images/*',['images']);
    gulp.watch(sourceDir+'/templates/*.ejs',['ejs']);
});
gulp.task('clean', function() {
    del([compileOutDir+'/css/*']);
    del([compileOutDir+'/js/*']);
    // del([compileOutDir+'/ejs/*']);
    del([compileOutDir+'/images/*']);
});
gulp.task('fcompile',['clean'],function() {
	gulp.start('styles','scripts','images','ejs');
});

// 默认任务
gulp.task('default',['browser-sync','watch']); //定义默认任务