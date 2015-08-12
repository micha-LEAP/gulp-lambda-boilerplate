var React = require('react');
var RootFactory = require('./components/root');

exports.handler = function(event, context) {
  var root = RootFactory({
    title: 'test-title',
    imgSrc: 'https://raw.githubusercontent.com/jaws-stack/JAWS-graphics/master/jaws_logo_javascript_aws.png'
  });

  context.done(null, React.renderToStaticMarkup(root));
};
