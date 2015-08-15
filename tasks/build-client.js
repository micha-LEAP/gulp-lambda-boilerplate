var argv        = require('yargs').argv;
var browserify  = require('browserify');
var buffer      = require('vinyl-buffer');
var gulpIf      = require('gulp-if');
var gutil       = require('gulp-util');
var source      = require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var uglyOptions = require('../shared/config').uglyOptions;
var vendors     = require('../shared/config').vendors;

module.exports = function (gulp, plugins) {
  return function (done) {
    var stream = browserify({
      entries: ['./client/app.js'],
      debug: true,
      fullPaths: false
    });

    vendors.forEach(function(vendor) {
      stream.external(vendor);
    });

    stream.bundle()
          .pipe(source('app.js'))
          .pipe(buffer())
          .pipe(gulpIf(!argv.dev, uglify(uglyOptions)))
          .pipe(gulp.dest('./dist/client'))
          .on('error', gutil.log)
          .on('end', done);
  };
};
