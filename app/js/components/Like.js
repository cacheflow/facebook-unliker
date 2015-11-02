var React = require('react');
var ReactDOM = require('react-dom');
var Promise = require('bluebird');
var delay = Promise.delay();
var update = require('react-addons-update');
var Unlike = require('./Unlike');
var Velocity = require("velocity-react");
var VelocityComponent = require("velocity-react/velocity-component");
var VelocityTransitionGroup = require("velocity-react/velocity-transition-group");

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
      <VelocityComponent
        enter={{animation: "fade"}}
        leave={{animation: "fade"}}
      >
      <li className="timeline-inverted">
        <div className="timeline-badge warning"><i className="glyphicon glyphicon-thumbs-down"></i></div>
        <div className="timeline-panel">
          <div className="timeline-heading">
            <h4 className="timeline-title">{this.props.name}</h4>
          </div>
          <div className="timeline-body">
          <p>
            <button className="btn btn-primary" id="unlike" onClick={this.unlikeButton}>
            Unlike
            </button>
          </p>
          </div>
        </div>
      </li>
    </VelocityComponent>
    );
  }
});

module.exports = Like;
