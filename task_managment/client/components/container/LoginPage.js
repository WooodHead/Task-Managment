var React=require('react');
var LoginForm=require('../LoginForm.js');
var Auth =require('../modules/Auth1');


module.exports=LoginPage= React.createClass( {

  /**
   * Class constructor.
   */
 getInitialState: function(props){
    // set the initial component state
     const storedMessage = localStorage.getItem('successMessage');
      var successMessage = '';
      if (storedMessage) {
        successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }
    return{
      errors: {},
      user: {
        email: '',
        password: ''
      },
      successMessage:successMessage
    };
  },

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm:function(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    /*console.log('email:', this.state.user.email);
    console.log('password:', this.state.user.password);*/
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = 'email='+email+'&password='+password;

    // create an AJAX request
    var self=this;
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function(){
      if (xhr.status === 200) {
        // success

        // change the component-container state
        self.setState({
          errors: {}
        });
          // save the token
        Auth.authenticateUser(xhr.response.token);
        // change the current URL to /
        self.props.router.replace('/');
        console.log('The form is valid');
      } else {
        // failure

        // change the component state
        var errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary1 = xhr.response.message;

       self.setState({
          errors:errors
        });
      }
    });
    xhr.send(formData);


  },

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser:function(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user:user
    });
  },

  /**
   * Render the component.
   */
  render:function() {
    return (
      <LoginForm
        onSubmitForm={this.processForm}
        onChangeInput={this.changeUser}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}/>
    )
  }

});