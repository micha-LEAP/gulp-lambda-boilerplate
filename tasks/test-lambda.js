var gutil = require('gulp-util');
var mocha = require('gulp-mocha');

exports.task = function (gulp, plugins) {
  return function (done) {

    gulp.src('./test/lambda/**/*.js', {read: false})
        .pipe(mocha())
        .on('end', done);

  };
};
