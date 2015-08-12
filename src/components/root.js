var React = require('react');

var RootComponent = React.createClass({
  render: function () {
    return (
      React.createElement("html", null,
        React.createElement("head", null,
          React.createElement("title", null, this.props.title)
        ),
        React.createElement("body", null,
          React.createElement("img", {src: this.props.imgSrc})
        )
      )
    )
  }
});

module.exports = React.createFactory(RootComponent);
