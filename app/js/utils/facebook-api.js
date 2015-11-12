var Promise = require('bluebird');

var FacebookApi = {

  login:function() {
    return new Promise(function(resolve, reject) {
      FB.login(function(data) {
        if(data.status === "connected") {
          resolve(data);
        }
        else if(data.status !== "connected") {
          reject(false);
        }
      },{
        scope: 'publish_actions'
      });
    });
  },

  getLikes:function() {
    return new Promise(function(resolve, reject) {
      FB.api("me/likes?fields=link,name,created_time&limit=100", function(response) {
        resolve(response);
      });
    });
  },

  getAllLikes:function(nextApiEndpoint) {
    var methodContext = this;
    FB.api(nextApiEndpoint, function(responseData) {
      if(responseData.paging) {
        methodContext.updateLikes(responseData.data);
        methodContext.getAllLikes(responseData.paging.next);
      }
    });
  },

  storeLikes:function(data) {
    return new Promise(function(resolve, reject) {
      resolve(data);
      console.log("calling likes from storelikes", data);
    });
  }
};

module.exports = FacebookApi;
