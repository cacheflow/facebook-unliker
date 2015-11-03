var React = require('react');
var ReactDOM = require('react-dom');
var update = require('react-addons-update');
var Velocity = require("velocity-react");
var VelocityComponent = require("velocity-react/velocity-component");
var VelocityTransitionGroup = require("velocity-react/velocity-transition-group");

var Unlike = React.createClass({
  propTypes: {
    name: React.PropTypes.string
  },

  reLike:function(unlikeProps) {
    var unlikedProps = this.props;
    this.props.redoLike(unlikedProps);
    // var unlikedFromState = this.state.unliked;
    // var newUnlikedState = update(
    //   unlikedFromState, {$push: [{
    //     name: props.name,
    //     id: props.id,
    //     link: props.link
    // }]});
    // this.setState({unliked: newUnlikedState});
  },
  render:function() {
    return (
        <li>
          <div className="timeline-badge primary"><i className="glyphicon glyphicon-thumbs-up"></i></div>
          <div className="timeline-panel">
            <div className="timeline-heading">
              <h4 className="timeline-title">{this.props.name}</h4>
              <p><small className="text-muted"><i className="glyphicon glyphicon-time"></i> 11 hours ago via Facebook</small></p>
            </div>
            <div className="timeline-body">
              <p>
                <button className="btn btn-success" id="like" onClick={this.reLike}>
                  Relike {this.props.name}
                </button>
              </p>
            </div>
          </div>
        </li>
    );
  }
});

module.exports = Unlike;
