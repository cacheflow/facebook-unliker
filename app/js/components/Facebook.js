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


  componentDidMount: function() {
    //Initialize the Facebook Javascript SDK
   window.fbAsyncInit = function() {
    FB.init({
      appId      : '1630177167258981',
      xfbml      : false,
      version    : 'v2.5',
      summary    : true
    });
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "http://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
 },

 setLikes:function(likes) {
  this.setState({likes: likes});
 },


 getFirstLikes:function(apiEndpoint) {
  return new Promise(function(resolve, reject) {
  FB.api("me/likes?fields=link,name,created_time&limit=100",
      function(likes) {
        resolve(likes);
      });
  });
 },

 getAllLikes: function(myLikes) {
    return new Promise(function(resolve, reject) {
      FB.api(myLikes.paging.next(function(data) {
        console.log(data);
      }));
    });
 },

 checkLoginStatus: function() {
  return new Promise(function(resolve, rejecet) {
    FB.login(function(data) {
      console.log(data);
      resolve(data);
    },{
      scope: 'publish_actions'
    });
  });
 },

 fetchAllLikes:function(nextApiEndpoint) {
  FB.api(nextApiEndpoint, function(responseData) {
    var allLikes = this.state.likes;
    allLikes = allLikes.concat(responseData.data);
    this.setState({likes: allLikes});
    console.log(this.state.likes);
    if(responseData.paging) {
      this.fetchAllLikes(responseData.paging.next);
    }
  }.bind(this));
  },

  getLikes:function() {
   Promise.all([this.checkLoginStatus(), this.getFirstLikes()]).then(function(data) {
    this.setStateAndFetchAllLikes(data[1].paging.next);
   }.bind(this));
  },

 setStateAndFetchAllLikes:function(nextApiEndpoint) {
   this.setState({firstLikes: nextApiEndpoint.data});
   this.fetchAllLikes(nextApiEndpoint);
 },

  handleClick:function() {
    this.getLikes();
    this.setState({clicked: true});
  },

  unlikeOnFacebook:function(propsId) {

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
        id: unlikedProps.id,
        link: unlikedProps.link
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
        id: props.id,
        link: props.link
    }]});
    this.setState({unliked: newUnlikedState});
  },

  postToFacebook:function() {
    var fbMsg = this.refs.post.value;
    FB.login(function(){
      FB.api('/me/feed', 'post', {message: 'Hello, world!'});
    }, {scope: 'publish_actions'});
  },

  checkClickedState:function() {
    var passDownLikesToChild = this.state.likes.map(function(likesResponse, index) {
      return (
        <Like
          key={likesResponse.name + index}
          name={likesResponse.name}
          link={likesResponse.link}
          id={likesResponse.id}
          arrIndex={index}
          updateUnlikes={this.updateUnlikes}
          unliked={this.state.unliked}
        />
      );
    }.bind(this));
    var passDownUnlikesToChild = this.state.unliked.map(function(unlike, index) {
      return (
          <Unlike
           key = {index + unlike.id}
           name={unlike.name}
           id={unlike.id}
           link={unlike.link}
           arrIndex={index}
           redoLike={this.redoLike}
          />
      );
    }.bind(this));

    if(this.state.clicked) {
      return (
        <div>
          <div className="page-header">
            <h1 id="timeline">Facebook Unliker: Unlike Embarrassing Stuff</h1>
          </div>
            <ul className="timeline">
               {passDownUnlikesToChild}
              {passDownLikesToChild}
            </ul>
        </div>
      );
    }
    else {
      return (
        <div>
          <div className="page-header">
            <h1 id="timeline">Facebook Unliker: Unlike Embarrassing Stuff</h1>
            <button className="btn btn-primary" onClick={this.handleClick}>Login into Facebook</button>
          </div>
        </div>
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
