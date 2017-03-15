var Auth  = require('../modules/Auth1.js');
var handleLogout=function(nextState, replace){

	var self1=replace;
	const xhr = new XMLHttpRequest();
	xhr.open('get', '/logout');
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.responseType = 'json';
	xhr.addEventListener('load', function(){
  		if (xhr.status === 200) {
   
     	 	// delete the token
			Auth.deauthenticateUser();
    		// change the current URL to /
			window.location='http://localhost:8081/';
   		} else {
    		// failure

    		// change the component state
    		errors.summary1 = xhr.response.message;
 		 }
	});
	xhr.send();
};
module.exports=handleLogout;