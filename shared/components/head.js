var React = require('react');

var HeadComponent = React.createClass({

  displayName: 'Head',

  render: function () {
    return (
      React.createElement("head", null,
        React.createElement("title", null, this.props.title),
        React.createElement("link", {
          href: this.props.assets + '/app.css',
          media: 'all',
          rel: 'stylesheet'
        }),
        React.createElement("script", {
          type: 'text/javascript',
          src: this.props.assets + '/vendors.js'
        })
      )
    )
  }

});

module.exports = React.createFactory(HeadComponent);
