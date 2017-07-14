import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import PastGraph from '../resources/PastGraph.js';

class MeasurementView extends Component {

	constructor(props){
		super(props);

		var measurements = this.props.measurements;
		
	}

	componentWillReceiveProps(nextProps){
		if (this.props.match.params !== null && this.props.match.params.measureName !== nextProps.match.params.measureName){
			this.measurement = nextProps.match.params.measureName	
		}
	}

	componentWillMount(){
		console.log("here we are!")
		if (this.props.match.params != null){
			this.measurement = this.props.match.params.measureName;	
		}
	}

	render(){
		console.log("adfasdfs", this.props)
		return (
			<div>
			
				<PastGraph />
			</div>
		)
	}

}

export default MeasurementView;