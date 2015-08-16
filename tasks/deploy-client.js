var async           = require('async');
var aws             = require('aws-sdk');
var awsSDKConfig    = require('../shared/config').awsSDKConfig;
var clientS3Config  = require('../shared/config').clientS3Config;
var fs              = require('fs');
var gulp            = require('gulp');
var gutil           = require('gulp-util');


var deployClientToRegion = function(region, cb) {

  var self = this;

  var params = {
    Key: 'builds/client/client.zip',
    Body: self.zipFile
  };

  clientS3Config.params = {
    Bucket: 'gulp-react-ssr'
  };

  var s3bucket = new aws.S3(clientS3Config);

  s3bucket.putObject(params, function(err, data) {
    if (err) {
      return gutil.log("Error uploading data: ", err);
    } else {
      cb(err, data);
    }
  });

};

var handleDeloyResult = function(err, results) {

  if (err) return this.done(err);

  gutil.log('Client.zip deployed to s3 gulp-react-ssr/builds/client/client.zip.');

  this.done();

};

module.exports = function (gulp, plugins) {
  return function (done) {

    fs.readFile('./dist/client.zip', function (err, zipFile) {

      var context = {
        done: done,
        zipFile: zipFile
      };

      async.map(awsSDKConfig.regions, deployClientToRegion.bind(context), handleDeloyResult.bind(context));

    });

  };
};
