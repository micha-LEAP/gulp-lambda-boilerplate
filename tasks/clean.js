var del = require('del');

exports.task = function (gulp, plugins) {

  return function(done) { del('./dist', done); };

};
