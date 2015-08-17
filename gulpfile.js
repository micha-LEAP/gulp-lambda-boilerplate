var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

function getTask(task, symbol) {
  return require('./tasks/' + task).task(gulp, plugins);
}

gulp.task('build-vendor',                 ['clean'], getTask('build-vendor'));
gulp.task('build-client',                 ['clean'], getTask('build-client'));
gulp.task('build-lambda',                 ['clean', 'resolve-lambda-path'], getTask('build-lambda'));
gulp.task('clean',                        getTask('clean'));
gulp.task('configure-aws-sdk',            getTask('configure-aws-sdk'));
gulp.task('create-bucket',                ['configure-aws-sdk', 'resolve-bucket-path'], getTask('create-bucket'));
gulp.task('deploy-client',                ['configure-aws-sdk', 'test-client', 'zip-client'], getTask('deploy-client'));
gulp.task('resolve-bucket-path',          getTask('resolve-bucket-path'));
gulp.task('resolve-lambda-path',          getTask('resolve-lambda-path'));
gulp.task('test-client',                  ['build-client'], getTask('test-client'));
gulp.task('test-lambda',                  ['build-lambda'], getTask('test-lambda'));
gulp.task('update-bucket-notifications',  ['create-bucket'], getTask('update-bucket-notifications'));
gulp.task('update-lambda-permissions',    ['upload-lambda'], getTask('update-lambda-permissions'));
gulp.task('upload-lambda',                ['configure-aws-sdk', 'test-lambda', 'zip-lambda'], getTask('upload-lambda'));
gulp.task('zip-lambda',                   ['build-lambda'], getTask('zip-lambda'));
gulp.task('zip-client',                   ['build-client'], getTask('zip-client'));

gulp.task('default', ['build-vendor', 'test-client', 'test-lambda'], function (done) {
  gulp.watch(['client/**/*.js'], ['build-vendor']);
  gulp.watch(['client/**/*.js', 'test/client/**/*.js'], ['test-client']);
  gulp.watch(['lambda/**/*.js', 'test/lambda/**/*.js'], ['test-lambda']);
});
