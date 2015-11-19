var gulp = require('gulp'),
    sass = require('gulp-sass'),               
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),       //自动添加浏览器前缀
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');
    clean = require('gulp-clean'),
    del = require('del');

gulp.task('sass', function(){
	return gulp.src('src/css/*.scss')
		.pipe(sass({style: 'expanded'}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
		}))
		.pipe(gulp.dest('src/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('release/css'))
		.pipe(notify({message: 'Sass task complate!'}));
});

gulp.task('less', function(){
	return gulp.src('src/css/*.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
		}))
		.pipe(gulp.dest('src/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('release/css'))
		.pipe(notify({message: 'Less task complate!'}));
});

gulp.task('js', function(){
	return gulp.src('src/js/*.js')
		// .pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('index.js'))
		// .pipe(gulp.dest('release/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('release/js'))
		.pipe(notify({message: 'Js task complate!'}));
});

gulp.task('copy', function(){
	return gulp.src('src/index.html')
		.pipe(gulp.dest('release'))
		.pipe(notify({message: 'Copy task complate!'}));
});

gulp.task('clean', function (){
	return gulp.src(['release', 'src/css/*.css'], {read: false})
		.pipe(clean())
		.pipe(notify({message: 'Clean task complate!'}));
});

gulp.task('default', ['clean'], function(){
	gulp.start('js', 'less', 'copy');
});