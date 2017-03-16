var React = require('react');
var Link=require('react-router').Link;

var Auth =require('./modules/Auth1');

module.exports=Dashboard = React.createClass({

     getInitialState: function(props){
		 props = props || this.props;
        return {};
	},
    render:function(){
		return(
        <div className="">
            <div className="col-lg-3">
            <div className="navbar-default sidebar" role="navigation">
                <div className="sidebar-nav navbar-collapse">
                    <ul className="nav in" id="side-menu">
                        <li className="sidebar-search">
                            <div className="input-group custom-search-form">
                                <input type="text" className="form-control" placeholder="Search..."/>
                                <span className="input-group-btn">
                                <button className="btn btn-default" type="button">
                                    <i className="fa fa-search"></i>
                                </button>
                                </span>
                            </div>
                        </li>
                        <li className="active">
                            <Link to='/dashboard/projects'> Projects</Link>
                        </li>
                        <li>
                           <Link to='/dashboard/activties'> Activties</Link>
                        </li>
                        <li>
                           <Link to='/dashboard/tasks'> Tasks</Link>
                        </li>
                    </ul>
                </div>
            </div>
            </div>
            <div className="col-lg-9">
                {this.props.children}
            </div>
        </div>

		)
	}

});

