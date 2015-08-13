var React = require('react');
var Head = require('./head');
var Body = require('./body');

var RootComponent = React.createClass({

  displayName: 'Root',

  render: function () {
    return (
      React.createElement("html", null,
        Head({
          assets: this.props.assets,
          title: this.props.title
        }),
        Body({
          assets: this.props.assets,
          img: this.props.img
        })
      )
    )
  }
});

module.exports = React.createFactory(RootComponent);
