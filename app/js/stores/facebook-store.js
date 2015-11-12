var FacebookDispatcher = require('../dispatchers/facebook-dispatcher');
var FacebookConstants = require('../constants/facebook-constants');
var assign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';
var _userInfo = {};
var _clicked = false;
var _likes = [];

function getLikes(data) {
  _likes.push(data);
  console.log("calling likes from store", _likes);
}
function checkLoginStatus(data) {
  _userInfo.name = data.response.name;
  _clicked = data.clicked;
  console.log(data);
}

function updateClickStatus(action) {
  _clicked = action;
}

function updateUserName(action) {
  _userInfo.name = action
  console.log("user is ", action)
}

 var FacebookStore = assign(EventEmitter.prototype, {
  emitChange:function() {
    this.emit(CHANGE_EVENT);
  },

  getUserName:function() {
    return _userInfo.name;
  },

  getClickedStatus:function() {
    return _clicked;
  },


  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }
 });

 FacebookDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case FacebookConstants.HANDLE_CLICK:
      checkLoginStatus(action);
      break;

    case FacebookConstants.UPDATE_CLICK_STATUS:
      updateClickStatus(action.data);
      break;

    case FacebookConstants.GET_USER_NAME:
      getUserName(action.data);
      break;

    case FacebookConstants.UPDATE_LIKES:
    getLikes(action.data);
    break;
  }

    FacebookStore.emitChange();
      return true;

 })

 module.exports = FacebookStore;
