var argv = require('yargs').argv;
var fs = require('fs');

exports.getBucketName = getBucketName = function () {

  if(typeof argv.name != 'string')
    throw new Error('Missing bucket --name argument e.g. gjolund-dev-builds');
  return argv.name;

};

exports.getBucketPath = getBucketPath = function () {

  var path = process.cwd() + '/buckets/' + getBucketName() + '.js';
  if(!fs.existsSync(path))
    throw new Error(path + ' does not exist.');
  return path;

};

exports.task = function (gulp, plugins) {
  return function (done) {

    var result = null;
    try {
      getBucketName();
      getBucketPath();
    } catch (err) {
      result = err;
    }
    done(result);

  };
}
