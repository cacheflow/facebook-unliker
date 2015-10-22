var React = require('react');
var ReactDOM = require('react-dom');


var Facebook = React.createClass({
  getInitialState: {
    return {
      likes: null
    }
  },
  componentDidMount: function() {
    //Initialize the Facebook Javascript SDK
   window.fbAsyncInit = function() {
    FB.init({
      appId      : '1630177167258981',
      xfbml      : false,
      version    : 'v2.4'
    });
  
    //Check to see if the user is logged in
    //or logged out
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
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "http://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
 },

  testAPI:function() {
    console.log("Welcome! Fetching your information");
    FB.api('/me', function(response) {
      console.log("Successful login for:" + response.name);
      console.log(response)
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

  getLikes:function() {
    FB.login(function(loginResponse){
      FB.api("me/likes", function(response) {
        console.log(response);
        this.setState(likes: response);
        console.log(this.state.likes);
      });
    }
  }

  handleClick:function() {
    this.getLikes()
  },

  render:function() {
    if(likes.state === null) {
      return (
        <button className="btn btn-success" onClick={this.handleClick}>
        </button>
      )
    }
    else {
      return (
        <div> {this.state.likes} </div> 
      )
    }
    
  }
   
});

ReactDOM.render(<Facebook />, document.getElementById('facebook-login'))