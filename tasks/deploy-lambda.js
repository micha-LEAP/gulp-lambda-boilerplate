var async = require('async');
var aws = require('aws-sdk');
var fs = require('fs');
var gutil = require('gulp-util');
var lambdaConfig = require('../shared/config').lambdaConfig;
var awsSDKConfig = require('../shared/config').awsSDKConfig;

var createNewLambdaFunction = function (lambda, cb) {

  var self = this;

  var params = {
      Code: {
          ZipFile: this.zipFile
      },
      FunctionName: lambdaConfig.FunctionName,
      Handler: lambdaConfig.Handler ? lambdaConfig.Handler : 'index.handler',
      Role: lambdaConfig.Role ? lambdaConfig.Role : awsSDKConfig.lambdaRoleARN,
      Runtime: lambdaConfig.Runtime,
      Description: lambdaConfig.Description ? lambdaConfig.Description : 'Created by Gulp deploy-lambda',
      MemorySize: lambdaConfig.MemorySize,
      Timeout: lambdaConfig.Timeout
  };

  gutil.log('Creating new Lambda function ' + params.FunctionName);

  lambda.createFunction(params, cb);

};

var updateLambdaFunction = function (lambda, cb) {

  var self = this;

  var code = {
      ZipFile: self.zipFile,
      FunctionName: lambdaConfig.FunctionName
  };

  var config = {
      FunctionName: lambdaConfig.FunctionName,
      Handler: lambdaConfig.Handler ? lambdaConfig.Handler : 'index.handler',
      Role: lambdaConfig.Role ? lambdaConfig.Role : awsSDKConfig.lambdaRoleARN,
      Description: lambdaConfig.Description ? lambdaConfig.Description : 'Updated by Gulp deploy-lambda',
      MemorySize: lambdaConfig.MemorySize,
      Timeout: lambdaConfig.Timeout
  };

  lambda.updateFunctionCode(code, function(err, data) {

    if (err) return self.done(err, err.stack); // an error occurred

    gutil.log('Updating existing Lambda function ' + code.FunctionName);

    lambda.updateFunctionConfiguration(config, cb);

  });

}

var deployLambdaToRegion = function(region, cb) {

  var self = this;

  var lambda = new aws.Lambda({
    apiVersion: lambdaConfig.apiVersion,
    accessKeyId: awsSDKConfig.accessKeyId,
    secretAccessKey: awsSDKConfig.secretAccessKey,
    region: region
  });

  // Check If Lambda Function Exists Already
  lambda.getFunction({
      FunctionName: lambdaConfig.FunctionName
  }, function(err, data) {

      if (err && err.code !== 'ResourceNotFoundException') return gutil.log("lambda.getFunction Error: " + err, err.stack);

      if (!data || !data.Code) {

        createNewLambdaFunction.apply(self, [ lambda, cb ]);

      } else {

        updateLambdaFunction.apply(self, [ lambda, cb ]);

      }
  });

};

var handleDeloyResult = function(err, results) {

  if (err) return this.done(err);

  gutil.log('Lambda Function deployed to AWS Lambda.');
  gutil.log('Deployed Lambda Function ARNs:');
  for (i = 0; i < results.length; i++) gutil.log(results[i].FunctionArn);

  this.done();

};

module.exports = function (gulp, plugins) {
  return function (done) {

    return fs.readFile('./dist/lambda.zip', function (err, zipFile) {

      var context = {
        done: done,
        zipFile: zipFile
      };

      async.map(awsSDKConfig.regions, deployLambdaToRegion.bind(context), handleDeloyResult.bind(context));

    });

  };
};
