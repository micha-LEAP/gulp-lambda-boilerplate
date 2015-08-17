var fs = require('fs');
var gutil = require('gulp-util');

exports.getAwsEnvPath = getAwsEnvPath = function () {

  return './.env'

};

exports.setAwsEnv = setAwsEnv =function () {

  if (fs.existsSync(getAwsEnvPath())) {

    require('dotenv').config({
      path: getAwsEnvPath()
    });

  } else {

    throw new Error('Error: No .env at ' + getAwsEnvPath());

  }

};

exports.getAwsRegions = getAwsRegions = function () {

  return process.env.AWS_LAMBDA_REGIONS.split(',');

};

exports.getAwsDefaultRegion = getAwsDefaultRegion = function () {

  return getAwsRegions()[0];

};

exports.getLambdaARN = getLambdaARN = function (name) {

  if (typeof name != 'string') throw new Error('getLambdaARN name param must be a string');

  var awsConfig = getAwsSDKConfig();

  return 'arn:aws:lambda:' + awsConfig.region + ':' + awsConfig.iamUserAccountNum + ':function:' + name;

};

exports.getBucketARN = getBucketARN = function (name) {

  if (typeof name != 'string') throw new Error('getBucketARN name param must be a string');

  var awsConfig = getAwsSDKConfig();

  return 'arn:aws:s3:::' + name;

};

exports.getAwsSDKConfig = getAwsSDKConfig = function () {

  return {
    accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ADMIN_SECRET_ACCESS_KEY,
    iamUser: process.env.AWS_IAM_USER,
    iamUserAccountNum: process.env.AWS_IAM_USER_ACCOUNT_NUM,
    region: getAwsDefaultRegion(),
    regions: getAwsRegions(),
    lambdaRoleARN: process.env.AWS_LAMBDA_ROLE_ARN,
    params: {}
  }

};

exports.task = function (gulp, plugins) {
  return function(done) {

    var result = null;

    try {

      setAwsEnv();
      getAwsSDKConfig();

    } catch (error) {

      result = error;

    }

    done(result);

  };
};
