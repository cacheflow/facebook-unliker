var React = require('react');
var ReactDOM = require('react-dom');
var Promise = require('bluebird');
var delay = Promise.delay();

var Facebook = React.createClass({
  getInitialState: function(){
    return {
      firstLikes: [],
      likes: []
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
      version    : 'v2.4',
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

  captureAllLikes:function(data) {
    var myLikes = [];
    myLikes.push(data);
    console.log("my likes are ", myLikes.length);
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
   var methodContext = this;
   Promise.all([this.checkLoginStatus(), this.getFirstLikes()]).then(function(data) {
    methodContext.setStateAndFetchAllLikes(data[1].paging.next);
   });
 },

  handleClick:function(formData) {
    this.getLikes();
  },

  render:function() {
    var passDownLikesToChild = this.state.likes.map(function(likesResponse) {
      return (
        <Like key={likesResponse.id}
          name={likesResponse.name}
          link={likesResponse.link}
          id={likesResponse.id}
        />
      );
    });
    return (
      <div>
        <button className="btn btn-primary" onClick={this.handleClick}>Login into Facebook</button>
        {passDownLikesToChild}
      </div>
    );
  }
});

var Like = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    link: React.PropTypes.string,
    id: React.PropTypes.string
  },
  unlikeButton:function(buttonId) {
    FB.api(this.props.id, function(response) {
      console.log(response);
    });
  },
  render:function() {
    var pageId = this.props.id;
    return (
      <div>
        <ul>
          <li>
            <button className="btn btn-primary"
               onClick={this.unlikeButton}
               >Unlike page {this.props.name}
             </button>
        </li>
        </ul>
      </div>
    );
  }
});



ReactDOM.render(<Facebook />, document.getElementById('main'));
