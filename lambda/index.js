var React = require('react');
var RootFactory = require('../shared/components/root');
var config = require('../shared/config');

exports.handler = function(event, context) {
  var root = RootFactory(config);

  context.done(null, React.renderToString(root));
};
