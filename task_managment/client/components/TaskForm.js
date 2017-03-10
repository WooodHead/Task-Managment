var React = require('react')
//Reflux = require('reflux')

//directoryActions = require('../actions/directoryActions.cjsx')
module.exports=TaskForm = React.createClass({

		getInitialState: function(props){
			props = props || this.props;
			return {
				idt:'',
				task_Name:'',
				description:'',
				duration:''
			};
			
		},
		_submitTask:function(e)  {
                 e.preventDefault();
          data ={
            idt: this.refs.idt.value?this.refs.idt.value:1,
            task_Name: this.refs.task_Name.value,
            Description: this.refs.description.value,
			duration:this.refs.duration.value
			};

         //if (data.task_Name && data.description){
            this.props.onSubmitTask(data);
			     // @TODO - Extract this to it's own method
			this.refs.idt.value = '';
            this.refs.task_Name.value = '';
            this.refs.description.value = '';
            this.refs.duration.value= '';
		//}

            //Reset field values after submit
         

	},
    
    render: function(){
		
		return(
			<div>
					<form onSubmit={this._submitTask}>
					<input type="hidden" name="idt" ref="idt" />
					<input type="text" name="task_Name" placeholder="task_Name" ref="task_Name" />
					<input type="text" name="description" placeholder="Description" ref="description" />
					<input type="text" name="duration" placeholder="duration" ref="duration" />
					<input type="submit" value="Add Task"  className="small button" />
					</form>
				
        </div>
		)
	}

});