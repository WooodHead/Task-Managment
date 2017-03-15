var React = require('react');

var Auth =require('./modules/Auth1');

module.exports=Home = React.createClass({

     getInitialState: function(props){
		 props = props || this.props;
        return {};
	},
    render:function(){
		return(
        <div className="row">
            <h5 id="form-header">Home</h5>
        </div>
		)
	}

});

