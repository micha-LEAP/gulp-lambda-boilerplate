var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

function getTask(task) {
    return require('./tasks/' + task)(gulp, plugins);
}

gulp.task('clean', getTask('clean'));
gulp.task('build-vendor',   ['clean'], getTask('build-vendor'));
gulp.task('build-client',   ['clean'], getTask('build-client'));
gulp.task('build-lambda',   ['clean'], getTask('build-lambda'));
gulp.task('test-client',    ['build-client'], getTask('test-client'));
gulp.task('test-lambda',    ['build-lambda'], getTask('test-lambda'));
gulp.task('zip-lambda',     ['build-lambda'], getTask('zip-lambda'));
gulp.task('zip-client',     ['build-client'], getTask('zip-client'));
gulp.task('deploy-lambda',  ['zip-lambda', 'test-lambda'], getTask('deploy-lambda'));
gulp.task('deploy-client',  ['zip-client', 'test-client'], getTask('deploy-client'));

gulp.task('default', ['build-vendor', 'test-client', 'test-lambda'], function (done) {
  gulp.watch(['client/**/*.js'], ['build-vendor']);
  gulp.watch(['client/**/*.js', 'test/client/**/*.js'], ['test-client']);
  gulp.watch(['lambda/**/*.js', 'test/lambda/**/*.js'], ['test-lambda']);
});
