var argv = require('yargs').argv;
var async = require('async');
var aws = require('aws-sdk');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

require('dotenv').config({
  path: process.cwd() + '/.env'
});

// Get Lambda Config
if (!fs.existsSync(process.cwd() + '/lambda.json')) return gutil.log('****** Error: lambda.json is missing in this folder');
var lambda_config = require(process.cwd() + '/lambda.json');

// First we need to clean out the dist folder and remove the compiled zip file.
gulp.task('clean', function(cb) {
  del('./dist',
    del('./archive.zip', cb)
  );
});

gulp.task('js', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/index.js',
    standalone: 'lambda'
  });

  return b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(gulpIf(!argv.dev, uglify()))
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/'));
});

gulp.task('test', function () {
  return gulp.src('./test/test.js', {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha());
});

// Now the dist directory is ready to go. Zip it.
gulp.task('zip', function() {
  return gulp.src(['dist/**/*', 'dist/.*'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});


gulp.task('upload', function() {

  var upload = function (err, zipFile) {

    var regions = process.env.AWS_LAMBDA_REGIONS.split(',');
    async.map(regions, function(region, cb) {

      aws.config.update({
        accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
        secretAccessKey: process.env.AWS_ADMIN_SECRET_ACCESS_KEY,
        region: region
      });

      var lambda = new aws.Lambda({
          apiVersion: '2015-03-31'
      });

      // Check If Lambda Function Exists Already
      lambda.getFunction({
          FunctionName: lambda_config.FunctionName
      }, function(err, data) {

          var params;

          if (err && err.code !== 'ResourceNotFoundException') return gutil.log(err, err.stack);

          if (!data || !data.Code) {


              /**
               * Create New Lambda Function
               */

              // Define Params for New Lambda Function
              params = {
                  Code: {
                      ZipFile: zipFile
                  },
                  FunctionName: lambda_config.FunctionName,
                  Handler: lambda_config.Handler ? lambda_config.Handler : 'index.handler',
                  Role: lambda_config.Role ? lambda_config.Role : process.env.AWS_LAMBDA_ROLE_ARN,
                  Runtime: lambda_config.Runtime,
                  Description: lambda_config.Description ? lambda_config.Description : 'A Lambda function that was created with the JAWS framework',
                  MemorySize: lambda_config.MemorySize,
                  Timeout: lambda_config.Timeout
              };

              gutil.log('****** JAWS: Uploading your Lambda Function to AWS Lambda with these parameters: ');
              gutil.log(params);

              lambda.createFunction(params, cb);

          } else {


              /**
               * Update Existing Lambda Function Code & Configuration
               */

              params = {
                  ZipFile: zipFile,
                  FunctionName: lambda_config.FunctionName
              };
              gutil.log('****** JAWS: Updating existing Lambda function code with these parameters:');
              gutil.log(params);

              lambda.updateFunctionCode(params, function(err, data) {

                  if (err) return gutil.log(err, err.stack); // an error occurred

                  var params = {
                      FunctionName: lambda_config.FunctionName,
                      Handler: lambda_config.Handler ? lambda_config.Handler : 'index.handler',
                      Role: lambda_config.Role ? lambda_config.Role : process.env.AWS_LAMBDA_ROLE_ARN,
                      Description: lambda_config.Description ? lambda_config.Description : 'A Lambda function that was created with the JAWS framework',
                      MemorySize: lambda_config.MemorySize,
                      Timeout: lambda_config.Timeout
                  };

                  gutil.log('****** JAWS: Updating existing Lambda function configuration with these parameters:');
                  gutil.log(params);

                  lambda.updateFunctionConfiguration(params, cb);
              });
          }
      });

    }, function(err, results) {

        if (err) return gutil.log(err);

        // Return
        gutil.log('****** JAWS:  Success! - Your Lambda Function has been successfully deployed to AWS Lambda.  This Lambda Function\'s ARNs are: ');
        for (i = 0; i < results.length; i++) gutil.log(results[i].FunctionArn);
        return;

    });
  };

  return fs.readFile('./dist.zip', upload);
});

// The key to deploying as a single command is to manage the sequence of events.
gulp.task('deploy', function(callback) {
  return runSequence(
    ['clean'],
    ['js'],
    ['test'],
    ['zip'],
    ['upload'],
    callback
  );
});

gulp.task('build', function(callback) {
  return runSequence(
    ['clean'],
    ['js'],
    ['test'],
    ['zip'],
    callback
  );
});
