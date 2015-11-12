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
var FacebookStore = require("../stores/facebook-store");
var FacebookActions = require("../actions/facebook-actions");

function getFacebookState() {
  return {
    username: FacebookStore.getUserName(),
    clicked: FacebookStore.getClickedStatus()
  };
}

var Facebook = React.createClass({
  getInitialState: function(){
    return getFacebookState();
  },

  componentDidMount: function() {
    //Initialize the Facebook Javascript SDK
    this.facebookApi();
    FacebookStore.addChangeListener(this._onChange);
  },

  componentWillUnMount: function() {
    FacebookStore.removeChangeListener(this._onChange);
  },

  _onChange:function() {
    //Get the state from the Facebook store
    this.setState(getFacebookState());
  },

  facebookApi:function() {
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
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  },
  handleClick: function() {
    FacebookActions.login();
  },

  checkClickedState:function() {
    if(this.state.clicked) {
      return (
         <div>
            <div className="page-header">
              <h1 id="timeline">Facebook Unliker: Unlike Embarrassing Stuff</h1>
            </div>
            <h1>Hello {this.state.username}</h1>
            <input type="text" ref="message" />
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
          <h4> As a kid I liked a bunch of crazy pages on Facebook.
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
