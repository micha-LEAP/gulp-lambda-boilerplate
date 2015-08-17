// Load the AWS SDK for Node.js
var aws = require('aws-sdk');
var gutil = require('gulp-util');
var getAwsSDKConfig = require('./configure-aws-sdk').getAwsSDKConfig;
var getLambdaConfig = require('./resolve-lambda-path').getLambdaConfig;

var removePermission = function (lambda, params, done) {

  lambda.removePermission({

    FunctionName: params.FunctionName, /* required */
    StatementId: params.StatementId /* required */

  }, function(err, data) {

    if (!err) {

      gutil.log('Removed ' + params.StatementId + ' permission from ' + params.FunctionName + ' lambda function');
      addPermission(lambda, params, done);

    } else {

      done(err);

    }
  });

};

var addPermission = function (lambda, params, done) {

  lambda.addPermission(params, function(err, data) {

    if (err && err.code === 'ResourceConflictException') {

      removePermission(lambda, params, done);

    } else {

      gutil.log('Added ' + params.StatementId + ' permission from ' + params.FunctionName + ' lambda function');
      done(err);

    }

  });
};


exports.task = function (gulp, plugin) {
  return function (done) {

    var params = getLambdaConfig().permissions;

    var lambda = new aws.Lambda(getAwsSDKConfig());

    addPermission(lambda, params, done);

  };
};
