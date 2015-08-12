var externalLib = require('./lib/external-lib');

exports.handler = function(event, context) {
  context.done(null, externalLib.demo() + " Gulp Lambda Boilerplate");
};
