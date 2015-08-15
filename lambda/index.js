var React = require('react');
var RootFactory = require('../shared/components/root');
var rootProps = require('../shared/mockData').rootProps;

exports.handler = function(event, context) {
  var root = RootFactory(rootProps);
  context.done(null, React.renderToString(root));
};
