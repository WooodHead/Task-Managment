var React=require('react');
var SignUpForm=require('../SignUpForm.js');


module.exports= SignupPage = React.createClass( {

  /**
   * Class constructor.
   */
 getInitialState: function(props) {
    // set the initial component state
    return {
      errors: {},
      user: {
        email: '',
        name: '',
        password: ''
      }
    };
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

    this.setState({user:user});
  },

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm:function(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

   /* console.log('name:', this.state.user.name);
    console.log('email:', this.state.user.email);
    console.log('password:', this.state.user.password);*/
 // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = 'name='+name+'&email='+email+'&password='+password;

    // create an AJAX request
     var self=this;
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function() {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        self.setState({
          errors: {}
        });
        // set a message
        localStorage.setItem('successMessage', xhr.response.message);
        console.log('The form is valid');
        self.props.router.replace('/login');
      } else {
        // failure

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
   * Render the component.
   */
  render:function() {
    return (
      <SignUpForm
        onSubmitForm={this.processForm}
        onChangeInput={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}/>
    )
  }

});