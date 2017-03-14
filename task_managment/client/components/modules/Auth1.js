var React=require('React');
var browserStorage = (typeof localStorage === 'undefined') ? null : localStorage;
module.exports=Auth1=React.createClass( {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
   statics: {
  authenticateUser:function(token) {
    if(browserStorage)
      localStorage.setItem('token', token);
  },

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  isUserAuthenticated:function() {
        if(browserStorage)
            return localStorage.getItem('token') !== null;
          else
            return false;
  },

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
   deauthenticateUser:function() {
        if(browserStorage)
            localStorage.removeItem('token');
  },

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  getToken:function() {
        if(browserStorage)
          return localStorage.getItem('token');
        else
          return null;
  }},
  render:function() { 
   return null; 
  }

});
