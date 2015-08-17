var getAwsSDKConfig = require('../tasks/configure-aws-sdk').getAwsSDKConfig;
var getLambdaARN = require('../tasks/configure-aws-sdk').getLambdaARN;
var lambdaName = require('../lambdas/gulp-s3-test/config').name;

exports.name = name = 'gjolund-123';

exports.create = {
  Bucket: name, /* required */
  ACL: 'public-read',
  CreateBucketConfiguration: {
    LocationConstraint: getAwsSDKConfig().region
  }
};

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketNotificationConfiguration-property
exports.notifications = {
  Bucket: name,
  NotificationConfiguration: { /* required */
    LambdaFunctionConfigurations: [
      {
        Events: [ /* required */
          's3:ObjectCreated:*'
          /* more items */
        ],
        LambdaFunctionArn: getLambdaARN(lambdaName)
      }
      /* more items */
    ]
  }
}
