var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

var jsSrc = ['**/*.js', '!**/node_modules/**/*'];

gulp.task('format', function () {
	return gulp.src(jsSrc)
		.pipe(jscs());
});

gulp.task('lint', function () {
	return gulp.src(jsSrc)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('server', function () {
	return nodemon({
		script: 'app.js',
		ext: 'js'
	});
});

gulp.task('watch', function () {
	gulp.watch(jsSrc, ['format', 'lint']);
});

gulp.task('default', ['server', 'format', 'lint', 'watch']);
