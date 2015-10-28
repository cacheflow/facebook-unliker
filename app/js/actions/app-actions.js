var AppConstnats = require('../constants/app-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher');

var AppActions = {
  callFacebookApi: function() {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.API_CALL
    });
  }
};

module.exports = AppActions;
