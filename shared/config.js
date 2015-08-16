var clientS3Bucket = 'gulp-react-ssr';
var fs = require('fs');
var gutil = require('gulp-util');
var lambdaConfigPath = process.cwd() + '/lambda/lambda.json';
var lambdaEnvPath = process.cwd() + '/lambda/.env';
var vendors = [ 'react' ];
var uglyOptions = {
  mangle: true,
  compress: {
    sequences: true,
    dead_code: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    drop_console: true
  }
};

if (fs.existsSync(lambdaConfigPath)) {
  var lambdaConfig = require(lambdaConfigPath);
} else {
  return gutil.log('Error: No lambda.json at ' + lambdaConfigPath);
}

if (fs.existsSync(lambdaConfigPath)) {
  require('dotenv').config({
    path: lambdaEnvPath
  });
} else {
  return gutil.log('Error: No .env at ' + lambdaEnvPath);
}

var defaultRegion = process.env.AWS_LAMBDA_REGIONS.split(',')[0];
var regions = process.env.AWS_LAMBDA_REGIONS.split(',');

exports.awsSDKConfig = {
  accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ADMIN_SECRET_ACCESS_KEY,
  region: defaultRegion,
  regions: regions,
  lambdaRoleARN: process.env.AWS_LAMBDA_ROLE_ARN
};

exports.clientS3Config = {
  accessKeyId: process.env.AWS_ADMIN_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ADMIN_SECRET_ACCESS_KEY
}

exports.lambdaConfig = lambdaConfig;
exports.vendors = vendors;
exports.uglyOptions = uglyOptions;
