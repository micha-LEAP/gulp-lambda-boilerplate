var argv = require('yargs').argv;
var fs = require('fs');

exports.getLambdaConfig = getLambdaConfig =  function () {
  if (fs.existsSync(getLambdaConfigPath())) {
    return require('.' + getLambdaConfigPath());
  } else {
    throw new Error('Error: No lambda.json at ' + getLambdaConfigPath());
  }
};

exports.getLambdaConfigPath = getLambdaConfigPath = function () {
  return './lambdas/' + getLambdaPath() + '/lambda.json';
};

exports.getLambdaDestAbsPath = getLambdaDestAbsPath = function () {
  return process.cwd() + '/dist/lambdas/' + getLambdaPath();
};

exports.getLambdaDestPath = getLambdaDestPath = function () {
  return './dist/lambdas/' + getLambdaPath();
};

exports.getLambdaDestIndexAbsPath = getLambdaDestIndexAbsPath = function () {
  return getLambdaDestAbsPath() + '/index.js';
}

exports.getLambdaDestIndexPath = getLambdaDestIndexPath = function () {
  return getLambdaDestPath() + '/index.js';
};

exports.getLambdaEntryPath = getLambdaEntryPath = function () {
  var lambdaEntry = './lambdas/' + getLambdaPath() + '/index.js';
  if(!fs.existsSync(lambdaEntry))
    throw new Error(lambdaEntry + ' does not exist.');
  return lambdaEntry;
};

exports.getLambdaPath = getLambdaPath = function () {
  if(typeof argv.path != 'string')
    throw new Error('Missing lambda --path argument e.g. api/show');
  return argv.path;
};

exports.task = function (gulp, plugin) {
  return function (done) {
    var result = null;
    try {
      getLambdaPath();
      getLambdaEntryPath();
    } catch (error) {
      result = error;
    };
    done(result);
  };
};