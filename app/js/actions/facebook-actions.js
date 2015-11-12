var FacebookConstants = require('../constants/facebook-constants');
var FacebookDispatcher = require('../dispatchers/facebook-dispatcher');
var FacebookApi = require('../utils/facebook-api');

var FacebookActions = {

  login:function() {
    var methodContext = this;
    FacebookApi.login().then(function() {
      return FacebookApi.getLikes();
    }).then(function(response) {
      if(response.paging.next) {
        methodContext.updateLikes(response.data);
        methodContext.getAllLikes(response.paging.next);
      }
      else {
        methodContext.updateLikes(response.data);
      }
    });
  },


  updateClickStatus:function(data) {
    FacebookDispatcher.handleViewAction({
      actionType: FacebookConstants.UPDATE_CLICK_STATUS,
      data: data
    });
  },

  updateLikes:function(data) {
    FacebookDispatcher.handleViewAction({
      actionType: FacebookConstants.UPDATE_LIKES,
      data: data
    });
  },

  updateUserName:function(username) {
    FacebookDispatcher.handleViewAction({
      actionType: FacebookConstants.UPDATE_USER_NAME,
      data: data
    });
  }
};

module.exports = FacebookActions;
