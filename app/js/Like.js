var React = require('react');
var ReactDOM = require('react-dom');
var Promise = require('bluebird');
var delay = Promise.delay();
var update = require('react-addons-update');
var _ = require('underscore');
var Unlike = require('./Unlike');

var Like = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    link: React.PropTypes.string,
    id: React.PropTypes.string,
    unliked: React.PropTypes.array,
    arrIndex: React.PropTypes.number,
    updateUnlikes: React.PropTypes.func
  },

  unlikeButton:function(buttonId) {
    var props = this.props;
    this.props.updateUnlikes(props);
  },

  render:function() {
    var pageId = this.props.id;
    return (
      <div>
          <button className="btn btn-primary" onClick={this.unlikeButton}
         >Unlike  {this.props.name}
         </button>
      </div>
    );
  }
});

module.exports = Like;
