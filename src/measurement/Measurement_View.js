import React, { Component } from 'react';

class MeasurementView extends Component {

	constructor(props){
		super(props);
		
		//This is how you refer to function clients passed through frmo the App.js

		/*this.search = this.props.client.api.search;
		this.search({type: "Observation", query: {subject: "99912345"}})
      			.then(function(r){
        			console.log("alsjdhfalsdkfjhalsdfjhasldfkjasldfajshd ",JSON.stringify(r,null,2));
	    		});
		*/
	}

	render(){
		return (
			<div>
				
			</div>
		)
	}

}

export default MeasurementView;