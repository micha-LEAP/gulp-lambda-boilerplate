var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var getLambdaTestPath = require('./resolve-lambda-path').getLambdaTestPath;

exports.task = function (gulp, plugins) {
  return function (done) {

    gulp.src(getLambdaTestPath(), {read: false})
        .pipe(mocha())
        .on('end', done);

  };
};
