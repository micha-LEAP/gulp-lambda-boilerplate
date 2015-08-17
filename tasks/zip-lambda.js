var fs = require('fs');
var getLambdaDestPath = require('./resolve-lambda-path').getLambdaDestPath;
var getLambdaConfig = require('./resolve-lambda-path').getLambdaConfig;
var gutil = require('gulp-util');
var zip   = require('gulp-zip');

exports.getDeployableFiles = getDeployableFiles = function () {

  if (fs.existsSync(getLambdaDestIndexPath())) {

    return [ getLambdaDestIndexPath() ];

  } else {

    throw new Error('Error: No deployable files at ' + getLambdaDestIndexPath());

  }
};

exports.getLambdaZipDestPath = getLambdaZipDestPath = function () {

  return getLambdaDestPath();

};

exports.getLambdaZipName = getLambdaZipName = function () {

  return 'index.zip';

};

exports.getLambdaZipPath = getLambdaZipPath = function () {

  return getLambdaZipDestPath() + '/' + getLambdaZipName();

};

exports.task = function (gulp, plugins) {
  return function (done) {

    gulp.src(getDeployableFiles())
        .pipe(zip(getLambdaZipName()))
        .pipe(gulp.dest(getLambdaZipDestPath()))
        .on('error', gutil.log)
        .on('end', done);

  };
};
