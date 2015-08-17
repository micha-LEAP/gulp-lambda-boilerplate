var async           = require('async');
var aws             = require('aws-sdk');
var getAwsSDKConfig = require('./configure-aws-sdk').getAwsSDKConfig;
var fs              = require('fs');
var gulp            = require('gulp');
var gutil           = require('gulp-util');


var deployClientToRegion = function(region, cb) {

  var self = this;

  self.awsSDKConfig.params.region = region;

  var s3bucket = new aws.S3(self.awsSDKConfig);

  s3bucket.putObject(self.objectParams, function(err, data) {

    err ? done("Error uploading data: ", err) : cb(err, data);

  });

};

var handleDeloyResult = function(err, results) {

  if (err) return this.done(err);

  gutil.log('Deployed to s3 ' + this.path);

  this.done();

};

exports.task = function (gulp, plugins) {
  return function (done) {

    fs.readFile('./dist/client.zip', function (err, zipFile) {

      var awsSDKConfig = getAwsSDKConfig();

      awsSDKConfig.params.Bucket = 'gjolund-dev-builds';

      var context = {
        awsSDKConfig: awsSDKConfig,
        done: done,
        objectParams: {
          Key: 'builds/client/client.zip',
          Body: zipFile
        }
      };

      context.path = awsSDKConfig.params.Bucket + '/' + context.objectParams.Key;

      async.map(awsSDKConfig.regions, deployClientToRegion.bind(context), handleDeloyResult.bind(context));

    });

  };
};
