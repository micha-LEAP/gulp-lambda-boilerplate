var getAwsSDKConfig = require('../../../tasks/configure-aws-sdk').getAwsSDKConfig;
var getBucketARN = require('../../../tasks/configure-aws-sdk').getBucketARN;

exports.name = name = "dev_unpack-client-build";
exports.bucketName = bucketName = "gjolund-client-builds";

exports.lambda = {
  apiVersion: "2015-03-31",
  FunctionName: name,
  Handler: "index.handler",
  Role: null,
  Runtime: "nodejs",
  Description: "None",
  MemorySize: 513,
  Timeout: 5
};

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#addPermission-property

exports.permissions = {
  Action: 'lambda:InvokeFunction', /* required */
  FunctionName: name, /* required */
  Principal: 's3.amazonaws.com', /* required */
  StatementId: 'lambdaInvokeFunction_via_s3_' + bucketName, /* required */
  SourceAccount: getAwsSDKConfig().iamUserAccountNum,
  SourceArn: getBucketARN(bucketName)
};
