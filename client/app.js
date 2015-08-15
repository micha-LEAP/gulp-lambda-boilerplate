var React = require('react');
var RootFactory = require('../shared/components/root');
var rootProps = require('../shared/mockData').rootProps;

/** If the context is a browser, render the app **/
if (typeof window !== 'undefined') {
  var root = RootFactory(rootProps);
  React.render(root, document);
}
