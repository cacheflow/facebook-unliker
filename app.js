var React = require('react');
var ReactDOM = require('react-dom');
var Promise = require('bluebird');
var delay = Promise.delay();
var update = require('react-addons-update');

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

 setStateAndFetchAllLikes:function(nextApiEndpoint) {
   this.setState({firstLikes: nextApiEndpoint.data});
   this.fetchAllLikes(nextApiEndpoint);
 },

  handleClick:function() {
    this.getLikes();
    this.setState({clicked: true});
  },


  updateUnlikes:function(unlike, arrIndex) {
    var unlikedFromState = this.state.unliked;
    unlikedFromState = unlikedFromState.concat(unlike);
    this.setState({likes:
      update(
        this.state.likes, {$splice: [[arrIndex, 1]]})
      });
      this.setState({unliked: unlikedFromState});
    console.log("these are your unlikes", this.state.likes.length);
  },

  render:function() {
    var methodContext = this;
    var showLoginOrLikes =
    this.state.clicked ? <h2>Pages Liked</h2> :
    <button className="btn btn-primary" onClick={this.handleClick}>Login into Facebook</button>
    var passDownLikesToChild = this.state.likes.map(function(likesResponse, index) {
      return (
        <Like key={likesResponse.id}
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
        <Unlike key={index} name = {unlike} arrIndex={index} />
      );
    });
    return (
      <div>
        {showLoginOrLikes}
        {passDownLikesToChild}
        <div>
           {passDownUnlikesToChild}
        </div>
      </div>
    );
  }
});


var Like = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    link: React.PropTypes.string,
    id: React.PropTypes.string,
    unliked: React.PropTypes.array,
    arrIndex: React.PropTypes.number
  },

  unlikeButton:function(buttonId) {
    var unlike = this.props.name;
    var arrIndex = this.props.arrIndex;
    FB.api(this.props.id, function(response) {
      console.log(response);
    });
    this.props.updateUnlikes(unlike, arrIndex);
  },

  render:function() {
    var pageId = this.props.id;
    return (
      <div>
        <button className="btn btn-primary" onClick={this.unlikeButton}
         >Unlike  {this.props.name}
        </button>
      </div>
    );
  }
});

var Unlike = React.createClass({
  propTypes: {
    name: React.PropTypes.string
  },

  render:function() {
    return (
      <div>
        <h2>Unliked pages</h2>
        <button className="btn btn-success">
          {this.props.name}
        </button>
     </div>
   );
  }
});

ReactDOM.render(<Facebook />, document.getElementById('main'));
