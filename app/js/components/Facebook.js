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
      clicked: false,
      username: "",
      showLoadingText: false
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
  var methodContext = this;
  FB.api("me/likes?fields=link,name,created_time&limit=100",
    function(likes) {
      this.setState({likes: likes});
      console.log("here are your likes from state", this.state.likes);
  }.bind(this));
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
    this.checkLoginStatus().then(function(response) {
      return new Promise(function(resolve, reject){
        FB.api("me/likes?fields=link,name,created_time&limit=100", function(response) {
          console.log(response);
          resolve(response);
        });
      }).then(function(response) {
        if(response.paging) {
          this.setStateAndFetchAllLikes(response.data, response.paging.next);
        }
        else {
          this.setState({likes: response.data});
        }
      }.bind(this));
    }.bind(this));
  },

 setStateAndFetchAllLikes:function(likesData, nextApiEndpoint) {
   this.setState({likes: likesData});
    this.fetchAllLikes(nextApiEndpoint);
   this.setState({showLoadingText: false});
 },

  handleClick:function() {
    this.setState({showLoadingText: true});
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

  logoutFacebook:function() {
    this.setState({likes: [],
      unliked: [],
      clicked: false
    });
    this.forceUpdate()
    FB.logout(function(response) {
      console.log(response);
    });
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
        >
        </Like>
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
          >
          </Unlike>
      );
    }.bind(this));

    if(this.state.clicked) {
      return (
         <div>
            <button className="btn btn-primary" id="logout" onClick={this.logoutFacebook}>Logout Facebook</button>

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
          <button className="btn btn-primary" id="login" onClick={this.handleClick}>Login into Facebook</button>
          <div className="page-header">
              <h1 id="timeline">Facebook Unliker: Unlike Embarrassing Stuff</h1>
          </div>
          <h4> As a I liked a bunch of crazy pages on Facebook.
          At that time it used to be called "Become a fan".
          I would like everything in sight and accumulated a bunch of weird liked pages.
          This app was created out of that problem. I am far too lazy to go back and find every
          page I liked then unlike it. This app simply gets all of your likes from newest to oldest
          and allows you to unlike them one by one. Also, if you make a mistake you can easily redo the
          like as well. And we do not store any of of your personal information. We just need you to login
          and connect your Facebook account so we can find the pages you have liked over the years.
          Have fun unliking stuff!
          </h4>
        </div>
      )
    }
  },

  render:function() {
    var showLoadingText = this.state.showLoadingText ? <h1>Hold on we are getting your likes.</h1> : <h1></h1>
    return (
      <div>
        {this.checkClickedState()}
        {showLoadingText}
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
