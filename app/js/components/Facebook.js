var React = require('react');
var ReactDOM = require('react-dom');
var Promise = require('bluebird');
var delay = Promise.delay();
var update = require('react-addons-update');
var _ = require('underscore');
var Unlike = require('./Unlike');
var Like = require('./Like');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var ReactCSSTransitionGroup = require('react/lib/ReactTransitionGroup');

var Facebook = React.createClass({
  getInitialState: function(){
    return {
      unliked: [],
      firstLikes: [],
      likes: [],
      clicked: false
    };
  },

  getDefaultProps: function() {
    return {
      value: "me/likes?fields=link,name,created_time&limit=100"
    };
  },
 
  getLikes:function() {
    var currentLikes = this.state.likes; 
    currentLikes = currentLikes.push(
      {"name": "bear", "id": "0"}, 
      {"name": "obama", "id": "1"}, 
      {"name": "new york", "id": "2"}, 
      {"name": "I know what you did last summer", "id": "3"}, 
      {"name": "vegan food", "id": "4"}, 
      {"name": "Starbucks", "id": "5"}, 
      {"name": "The cool kid who likes to party", "id": "6"},
      {"name": "Katy Perry", "id": "7"},
      {"name": "The Weeknd", "id": "8"},  
    )
    console.log(this.state.likes);
  },

  handleClick:function() {
    this.getLikes();
    this.setState({clicked: true});
  },

  redoLike:function(unlikedProps) {
    this.setState({unliked:
      update(
        this.state.unliked, {$splice: [[unlikedProps.arrIndex, 1]]})
    });
    var likedFromState = this.state.likes;
    var newLikedState = update(
      likedFromState, {$unshift: [{
        name: unlikedProps.name,
        id: unlikedProps.arrIndex
    }]});
    this.setState({likes: newLikedState});

    console.log("decreasing your length", this.state.unliked.length);
  },

  updateUnlikes:function(props) {
    this.setState({likes:
      update(
        this.state.likes, {$splice: [[props.arrIndex, 1]]})
      });
    var unlikedFromState = this.state.unliked;
    var newUnlikedState = update(
      unlikedFromState, {$unshift: [{
        name: props.name,
        id: props.arrIndex
    }]});
    this.setState({unliked: newUnlikedState});
  },

  checkClickedState:function() {

    var passDownLikesToChild = this.state.likes.map(function(likesResponse, index) {
      return (
        <Like
          key={likesResponse.name + index}
          name={likesResponse.name}
          arrIndex={index}
          updateUnlikes={this.updateUnlikes}
          unliked={this.state.unliked}
        >
        </Like> 
      );
    }.bind(this));
    var passDownUnlikesToChild = this.state.unliked.map(function(unlike, index) {
      return (
          <Unlike
           key = {index + unlike}
           name={unlike.name}
           id={index.id}
           redoLike={this.redoLike}
          >
          </Unlike>
      );
    }.bind(this));

    if(this.state.clicked) {
      return (
        <ul className="timeline">
           {passDownUnlikesToChild}
          {passDownLikesToChild}
        </ul>
      );
    }
    else {
      return (
        <button className="btn btn-primary" id="login" onClick={this.handleClick}>Login into Facebook</button>
      )
    }
  },

  render:function() {
    return (
      <div>
        {this.checkClickedState()}
      </div>
    );
  }
});

ReactDOM.render((
  <Router>
    <Route path="/" component={Facebook}>
    </Route>
  </Router>
), document.getElementById("facebook-container"))


module.exports = Facebook;
