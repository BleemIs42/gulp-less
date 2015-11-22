var gulp = require('gulp'),              
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),       //自动添加浏览器前缀
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    runSequence = require('run-sequence'),
    notify = require('gulp-notify');
    connect = require('gulp-connect'),
    clean = require('gulp-clean');

gulp.task('cleanHtml', function (){
	return gulp.src('./release/*.html', {read: false})
		.pipe(clean())
		.pipe(notify({message: 'cleanHtml task complate!'}));
});
gulp.task('copyHtml', function(){
	return gulp.src('./src/index.html')
		.pipe(gulp.dest('./compress/'))
		.pipe(gulp.dest('./release/'))
		.pipe(notify({message: 'copyHtml task complate!'}));
});
gulp.task('html',function(){
	runSequence('cleanHtml', 'copyHtml');
});

gulp.task('cleanLess', function (){
	return gulp.src('./release/css/*.css', {read: false})
		.pipe(clean())
		.pipe(notify({message: 'cleanLess task complate!'}));
});
gulp.task('miniLess', function(){
	return gulp.src('./src/css/*.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
            cascade: true,  //美化属性
            remove:true     //是否去掉不必要的前缀 默认：true 
		}))
		.pipe(gulp.dest('./src/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('./compress/css'))
		.pipe(notify({message: 'miniLess task complate!'}));
});
//添加MD5后缀
gulp.task('md5Less', function(){
	return gulp.src('./compress/css/*.css')
		.pipe(rev())
		.pipe(gulp.dest('./release/css'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./release/css'))
		.pipe(notify({message: 'md5Less task complate!'}))
});
//替换html中的css
gulp.task('replaceLess', function(){
	return gulp.src(['./release/css/rev-manifest.json', 'release/index.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('./release/'))
		.pipe(connect.reload())
		.pipe(notify({message: 'replaceLess task complate!'}));
});
gulp.task('less',function(){
	runSequence('cleanLess', 'miniLess', 'md5Less', 'replaceLess');
});

gulp.task('cleanJs', function (){
	return gulp.src('./release/js/*.js', {read: false})
		.pipe(clean());
});
gulp.task('miniJs', function(){
	return gulp.src('./src/js/*.js')
		// .pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('index.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('./compress/js'))
		.pipe(notify({message: 'miniJs task complate!'}));
});
//添加MD5后缀
gulp.task('md5Js', function(){
	return gulp.src('./compress/js/*.js')
		.pipe(rev())
		.pipe(gulp.dest('./release/js'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('./release/js'))
		.pipe(notify({message: 'md5Js task complate!'}));
});
//替换html中的js
gulp.task('replaceJs', function(){
	return gulp.src(['./release/js/rev-manifest.json', 'release/*.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('./release/'))
		.pipe(connect.reload())
		.pipe(notify({message: 'replaceJs task complate!'}));
});
gulp.task('js',function(){
	runSequence('cleanJs', 'miniJs', 'md5Js', 'replaceJs');
});

gulp.task('clean', function (){
	return gulp.src(['./release', './compress', './src/css/*.css'], {read: false})
		.pipe(clean())
		.pipe(notify({message: 'Clean task complate!'}));
});

gulp.task('server', function(){
	connect.server({
		root: 'release',
		port: 8000,
		livereload: true
	});
});

gulp.task('watch', function(){

	gulp.watch('./src/*.html', function(event){
		console.log();
		console.log("------------------------" + event.type + "--------------------------------");
		console.log("Files " + event.path + " was " + event.type);
		runSequence('cleanHtml', 'copyHtml', 'replaceLess', 'replaceJs');
	});
	
	gulp.watch('./src/css/*.less', function(event){
		console.log();
		console.log("------------------------" + event.type + "--------------------------------");
		console.log("Files " + event.path + " was " + event.type);
		runSequence('cleanHtml', 'copyHtml', 'replaceJs', 'less');
	});

	gulp.watch('./src/js/*.js', function(event){
		console.log();
		console.log("------------------------" + event.type + "--------------------------------");
		console.log("Files " + event.path + " was " + event.type);
		runSequence('cleanHtml', 'copyHtml', 'replaceLess', 'js');
	});

});

gulp.task('default', function(){
	runSequence(
				['cleanHtml', 'cleanLess', 'cleanJs'], 
				['copyHtml', 'miniLess', 'miniJs'],
				['md5Less', 'md5Js'],
				'replaceLess', 'replaceJs', 'server', 'watch'
				);
});
