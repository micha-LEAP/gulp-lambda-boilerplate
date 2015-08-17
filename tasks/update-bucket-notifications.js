// Load the AWS SDK for Node.js
var aws = require('aws-sdk');
var gutil = require('gulp-util');
var getAwsSDKConfig = require('./configure-aws-sdk').getAwsSDKConfig;
var getBucket = require('./resolve-bucket-path').getBucket;


exports.task = function (gulp, plugin) {
  return function (done) {

    var bucket = getBucket();

    var s3bucket = new aws.S3(getAwsSDKConfig());

    s3bucket.putBucketNotificationConfiguration(bucket.notifications, function(err, data) {
      if (!err) gutil.log('Bucket ' + bucket.name + ' notification config updated.');
      done(err);
    });

  };
};
