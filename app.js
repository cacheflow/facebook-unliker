var React = require('react');
var ReactDOM = require('react-dom');
var current = require('bluebird');

var Facebook = React.createClass({
  getInitialState: function( ){
    return {
      likes: null
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

 getLikes:function() {
   var self = this;
    FB.getLoginStatus(function(response) {
      if(response.status == "connected") {
        FB.api("me/likes", function(response) {
         self.setState({likes: response});
        });
      }
      else if(response.status === "not_authorized") {
        console.log("You're not logged in. Please log in.");
      }
      else {
        console.log("Please login into facebook");
      }
    });
  },
 checkLoginStatus: function() {
   FB.getLoginStatus(function(response) {
     if (response.status == "connected") {
       this.getLikes();
      }
      else if(response.status === "not_authorized") {
        console.log("You're not logged in. Please log in.");
      }
      else {
        console.log("Please login into facebook");
      }
    }.bind(this));
  },

  testAPI:function() {
    console.log("Welcome! Fetching your information");
    FB.api('/me', function(response) {
      console.log("Successful login for:" + response.name);
      console.log(response);
    });
  },

  deleteLikes: function(post_id) {
    FB.api("post_id" + "/likes", "DELETE", function(response) {
      if(response && !response.error) {
        console.log(response);
      }
    });
  },

  // checkStatus: function(response) {
  //   console.log('checkStatus being called');
  //   console.log(response);

  //   if (response.status == "connected") {
  //     this.getLikes();
  //   }
  //   else if(response.status === "not_authorized") {
  //     console.log("You're not logged in. Please log in.");
  //   }
  //   else {
  //     console.log("Please login into facebook");
  //   }
  // },

  handleClick:function() {
    this.getLikes();
  },

  render:function() {
    if(this.state.likes !== null) {
      return (
        <Like data ={this.state.likes} />
      );
    }
    else {
      return (
        <button className="btn btn-primary" onClick={this.handleClick}>
        </button>
      );
    }
  }
});

var Like = React.createClass({
  propTypes: {
    data: React.PropTypes.object
  },

  render:function() {
    var myLikes = this.props.data.data.map(function(data) {
      return (
        <div>
          <div>{data.name}</div>
          <div>{data.id}</div>
        </div>
      );
    });
    return (
      <div> {myLikes}</div>
    );
  }
});

ReactDOM.render(<Facebook />, document.getElementById('main'));
