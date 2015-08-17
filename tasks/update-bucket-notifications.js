// Load the AWS SDK for Node.js
var aws = require('aws-sdk');
var gutil = require('gulp-util');
var getAwsSDKConfig = require('./configure-aws-sdk').getAwsSDKConfig;
var getBucketPath = require('./resolve-bucket-path').getBucketPath;


exports.task = function (gulp, plugin) {
  return function (done) {

    var params = require(getBucketPath()).notifications;

    var s3bucket = new aws.S3(getAwsSDKConfig());

    s3bucket.putBucketNotificationConfiguration(params, function(err, data) {
      done(err);
    });

  };
};
