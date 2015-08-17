var async = require('async');
var aws = require('aws-sdk');
var fs = require('fs');
var gutil = require('gulp-util');
var getLambdaConfig = require('./resolve-lambda-path').getLambdaConfig;
var getAwsSDKConfig = require('./configure-aws-sdk').getAwsSDKConfig;
var getLambdaZipPath = require('./zip-lambda').getLambdaZipPath;

var createNewLambdaFunction = function (lambda, cb) {

  var self = this;

  var params = {
      Code: {
          ZipFile: this.zipFile
      },
      FunctionName: self.lambdaConfig.FunctionName,
      Handler: self.lambdaConfig.Handler ? self.lambdaConfig.Handler : 'index.handler',
      Role: self.lambdaConfig.Role ? self.lambdaConfig.Role : self.awsSDKConfig.lambdaRoleARN,
      Runtime: self.lambdaConfig.Runtime,
      Description: self.lambdaConfig.Description ? self.lambdaConfig.Description : 'Created by Gulp deploy-lambda',
      MemorySize: self.lambdaConfig.MemorySize,
      Timeout: self.lambdaConfig.Timeout
  };

  gutil.log('Creating new Lambda function ' + params.FunctionName);

  lambda.createFunction(params, cb);

};

var updateLambdaFunction = function (lambda, cb) {

  var self = this;

  var code = {
      ZipFile: self.zipFile,
      FunctionName: self.lambdaConfig.FunctionName
  };

  var config = {
      FunctionName: self.lambdaConfig.FunctionName,
      Handler: self.lambdaConfig.Handler ? self.lambdaConfig.Handler : 'index.handler',
      Role: self.lambdaConfig.Role ? self.lambdaConfig.Role : self.awsSDKConfig.lambdaRoleARN,
      Description: self.lambdaConfig.Description ? self.lambdaConfig.Description : 'Updated by Gulp deploy-lambda',
      MemorySize: self.lambdaConfig.MemorySize,
      Timeout: self.lambdaConfig.Timeout
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
    apiVersion: self.lambdaConfig.apiVersion,
    accessKeyId: self.awsSDKConfig.accessKeyId,
    secretAccessKey: self.awsSDKConfig.secretAccessKey,
    region: region
  });

  // Check If Lambda Function Exists Already
  lambda.getFunction({
      FunctionName: self.lambdaConfig.FunctionName
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

  var self = this;

  if (err) return self.done(err);

  for (i = 0; i < results.length; i++) {
    gutil.log('Deployed Lambda Function ARNs:');
    gutil.log(self.lambdaConfig.FunctionName + ' : ' + results[i].FunctionArn);
  }

  self.done();

};

exports.task = function (gulp, plugins) {
  return function (done) {

    return fs.readFile(getLambdaZipPath(), function (err, zipFile) {

      var awsSDKConfig = getAwsSDKConfig()

      var context = {
        done: done,
        zipFile: zipFile,
        lambdaConfig: getLambdaConfig().lambda,
        awsSDKConfig: awsSDKConfig
      };

      async.map(awsSDKConfig.regions, deployLambdaToRegion.bind(context), handleDeloyResult.bind(context));

    });

  };
};
