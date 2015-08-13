var config = require('../shared/config');
var RootFactory = require('../shared/components/root');
var React = require('react');

/** If the context is a browser, render the app **/
if (typeof window !== 'undefined') {
  var root = RootFactory(config);
  React.render(root, document);
}
