var React = require('react');
var ReactDOM = require('react-dom');
var Promise = require('bluebird');
var delay = Promise.delay();

var Facebook = React.createClass({
  getInitialState: function(){
    return {
      firstLikes: [],
      secondLikes: []
    };
  },

  getDefaultProps: function() {
    return {
      value: "me/likes?fields=link,name,created_time&limit=200"
    };
  },

  componentDidMount: function() {
    //Initialize the Facebook Javascript SDK
   window.fbAsyncInit = function() {
    FB.init({
      appId      : '1630177167258981',
      xfbml      : false,
      version    : 'v2.4'
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

 setSecondLikes:function(secondLikesFromApi) {
  this.setState({secondLikes: secondLikesFromApi});
  console.log("state of second likes", this.state.secondLikes);
 },

 facebookAsPromises:function() {
   var fb = Promise.promisifyAll(FB);
   return fb;
 },

 facebookLoginAsPromise: function() {
   var fbLogin = Promise.promisify(FB.getLoginStatus);
   return fbLogin;
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
    FB.getLoginStatus(function(data) {
      resolve(data);
    });
  });
 },

  setStateAndFetchAllLikes:function(nextApiEndpoint) {
    this.setState({firstLikes: nextApiEndpoint.data});
    this.fetchAllLikes(nextApiEndpoint);
  },

  fetchAllLikes:function(nextApiEndpoint) {
    var myLikes = [];
    FB.api(nextApiEndpoint, function(likes) {
      if(nextApiEndpoint) {
        this.fetchAllLikes(likes.paging.next);
        console.log(likes);
        myLikes.push(likes);
      }
      else {
        console.log("nope");
      }
    }.bind(this));
  },


 getLikes:function() {
   var methodContext = this;
  Promise.all([this.checkLoginStatus(), this.getFirstLikes()]).then(function(data) {
    methodContext.setStateAndFetchAllLikes(data[1].paging.next);
  });

 },
  handleClick:function(formData) {
    this.getLikes();
  },

  render:function() {
    return (
      <button className="btn btn-primary" onClick={this.handleClick}>Login into Facebook</button>
    );
  }
});

var Like = React.createClass({
  propTypes: {
    likes: React.PropTypes.object,
  },

  render:function() {
    console.log("here's your data", this.props.likes);
  }
});



ReactDOM.render(<Facebook />, document.getElementById('main'));
