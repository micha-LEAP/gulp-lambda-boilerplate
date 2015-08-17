var argv        = require('yargs').argv;
var browserify  = require('browserify');
var buffer      = require('vinyl-buffer');
var gulpIf      = require('gulp-if');
var gutil       = require('gulp-util');
var source      = require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var uglyOptions = require('../shared/config').uglyOptions;
var vendors     = require('../shared/config').vendors;

exports.task = function (gulp, plugins) {
  return function (done) {

    var stream = browserify({
      debug: false,
      require: vendors
    });

    stream.bundle()
          .pipe(source('vendors.js'))
          .pipe(buffer())
          .pipe(gulpIf(!argv.dev, uglify(uglyOptions)))
          .pipe(gulp.dest('./dist/vendor'))
          .on('error', gutil.log)
          .on('end', done);

  };
};
