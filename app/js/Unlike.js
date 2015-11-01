var React = require('react');
var ReactDOM = require('react-dom');
var update = require('react-addons-update');

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
      <div>
        <h2>Unliked pages</h2>
          <button className="btn btn-success" onClick={this.reLike}>
            {this.props.name}
          </button>
     </div>
   );
  }
});

module.exports = Unlike;
