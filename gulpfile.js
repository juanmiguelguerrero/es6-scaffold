var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var watch = require('gulp-watch');
var del = require('del');
var nunjucks = require('gulp-nunjucks-render');


gulp.task('connect', function() {
	connect.server({
		base: 'http://localhost',
		port: 8080,
		root: './dist',
		livereload: true
	});
});

gulp.task('css', function() {
    gulp.src('./scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist/css'))
        .pipe(connect.reload());
});

gulp.task('js', function() {
	browserify('./src/main.js')
		.transform(babelify)
		.bundle()
		.pipe(source('main.js'))
		.pipe(gulp.dest('./dist/js'))
		.pipe(connect.reload());
});

gulp.task('html', function() {
	return gulp.src('src/templates/*.html')
	.pipe(nunjucks({
		path: ['./src/templates']
	  }))
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload());
});


gulp.task("clean", function () {
  return del("./dist/*.html");
});

gulp.task('watch', function() {
	gulp.watch('./scss/**/*.scss', ['css']);
	gulp.watch('./src/**/*.js', ['js']);
	// gulp.watch('./src/**/*.html', ['html', 'clean']);
	gulp.watch('./src/**/*.html', ['html']);

	// Fuerza la tarea cuando se crea un nuevo archivo html
	// watch('src/**/*.html', function () {
	// 	gulp.src('./src/**/*.html')
	// 		.pipe(gulp.dest('./dist'))
	// 		.pipe(connect.reload());
    // });
});


gulp.task('default', ['connect', 'watch', 'js', 'css', 'html']);
