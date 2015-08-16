// Load the AWS SDK for Node.js
var aws = require('aws-sdk');
var gutil = require('gulp-util');
var getAwsSDKConfig = require('./configure-aws-sdk').getAwsSDKConfig;
var getBucketPath = require('./resolve-bucket-path').getBucketPath;


exports.task = function (gulp, plugin) {
  return function (done) {

    var bucketConfig = getAwsSDKConfig();
    bucketConfig.params = require(getBucketPath());

    var s3bucket = new aws.S3(bucketConfig);

    s3bucket.createBucket(function(err, data) {
      if (err && err.code === 'BucketAlreadyOwnedByYou') {
        err = null;
      }
      done(err);
    });

  };
};
