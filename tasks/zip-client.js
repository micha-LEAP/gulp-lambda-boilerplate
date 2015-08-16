var gutil = require('gulp-util');
var zip   = require('gulp-zip');

module.exports = function (gulp, plugins) {
  return function (done) {
    gulp.src(['dist/client/**/*'])
        .pipe(zip('client.zip'))
        .pipe(gulp.dest('./dist'))
        .on('error', gutil.log)
        .on('end', done);
  };
};
