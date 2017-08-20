var gulp = require('gulp');

var sass = require('gulp-sass');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify')
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');
var connect = require('gulp-connect');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var nunjucks = require('gulp-nunjucks-render');

var browserify = require('browserify');
var babelify = require('babelify');

var del = require('del');
var glob = require('glob');
var merge = require('merge-stream');
var source = require('vinyl-source-stream');

function consoleTimeStamp(txt) {
	var date = new Date;
	var timeStamp = '[' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '] ';

	console.log( timeStamp + txt );
}

gulp.task('connect', function() {
	connect.server({
		base: 'http://localhost',
		port: 8080,
		root: './public',
		livereload: true
	});
});

watch('scss/**/*.scss', function() {
	consoleTimeStamp('Processing CSS styles')
	console.time('Time');

    gulp.src('./scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./public/css'))
        .pipe(connect.reload());

	console.timeEnd('Time');
});

watch('src/templates/*.html', function () {
	consoleTimeStamp('Rendering HTML templates')
	console.time('Time');

	del('./public/*.html');
	gulp.src('src/templates/*.html')
		.pipe(nunjucks({
			path: ['./src/templates']
		  }))
		.pipe(gulp.dest('./public'))
		.pipe(connect.reload());

	console.timeEnd('Time');
});

watch('src/js/*.js', function () {
	consoleTimeStamp('Transpiling JS files')
	console.time('Time');

	del('./public/js/*.js');

	var files = glob.sync('./src/js/*.js');
	merge(files.map(function(file) {
		return browserify({
			entries: file,
   			debug: true
		})
			.transform(babelify)
			.bundle()
			.pipe(source(file))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
		    .pipe(uglify())
		    .pipe(sourcemaps.write('./'))
			.pipe(rename({dirname: ''}))
			.pipe(gulp.dest("./public/js/"))
	}))
			.pipe(connect.reload());;

	console.timeEnd('Time');
});


gulp.task('default', ['connect']);
