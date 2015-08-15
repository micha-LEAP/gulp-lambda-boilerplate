var gutil = require('gulp-util');
var mocha = require('gulp-mocha');

module.exports = function (gulp, plugins) {
  return function (done) {
    gulp.src('./test/lambda/**/*.js', {read: false})
        .pipe(mocha())
        .on('error', gutil.log)
        .on('end', done);;
  };
};
