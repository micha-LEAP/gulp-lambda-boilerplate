var React = require('react');
var Timer = require('./timer');

var BodyComponent = React.createClass({

  displayName: 'Body',

  render: function () {
    return (
      React.createElement("body", null,
        Timer({
          start: new Date(),
          assets: this.props.assets
        }),
        React.createElement("img", {src: this.props.assets + '/' + this.props.img}),
        React.createElement("script", {
          type: 'text/javascript',
          src: this.props.assets + '/app.js'
        })
      )
    )
  }
});

module.exports = React.createFactory(BodyComponent);
