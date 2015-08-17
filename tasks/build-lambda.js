var argv                = require('yargs').argv;
var browserify          = require('browserify');
var buffer              = require('vinyl-buffer');
var getLambdaEntryPath  = require('./resolve-lambda-path').getLambdaEntryPath;
var getLambdaDestPath   = require('./resolve-lambda-path').getLambdaDestPath;
var gulpIf              = require('gulp-if');
var gutil               = require('gulp-util');
var source              = require('vinyl-source-stream');
var uglify              = require('gulp-uglify');
var uglyOptions         = require('../shared/config').uglyOptions;

exports.task = function (gulp, plugins) {
  return function (done) {

    var stream = browserify({
      entries: getLambdaEntryPath(),
      node: true,
      standalone: 'lambda'
    });

    stream.bundle()
          .pipe(source('index.js'))
          .pipe(buffer())
          .pipe(gulpIf(!argv.dev, uglify(uglyOptions)))
          .pipe(gulp.dest(getLambdaDestPath()))
          .on('error', gutil.log)
          .on('end', done);

  };
};
