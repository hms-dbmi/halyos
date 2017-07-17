import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import PastGraph from '../resources/PastGraph.js';

import { getValueQuantities } from '../utils/general_utils.js'

class MeasurementView extends Component {

	constructor(props){
		super(props);

		var measurements = this.props.measurements;
		this.state = {measurementList:[]};
	}
	
	componentWillMount(){
		if (this.props.match.params != null){
			this.measureId = this.props.match.params.measureId;	
		}
		
	}
	
	componentWillReceiveProps(nextProps){
		if (this.props.match.params === null){
			return;
			
		}
		if (this.props.match.params.measureId !== nextProps.match.params.measureId){
			this.measureId = nextProps.match.params.measureId;
			this.setState({measurementList:[]});
			nextProps.observations.then(this.getObservationByName.bind(this));

		}
	}

	componentDidMount(){
		this.props.observations.then(this.getObservationByName.bind(this));

	}

	getObservationByName(value){
		// valueQuantity, valueCodeableConcept, valueString, valueBoolean, valueRange, valueRatio, valueSampledData, valueAttachment, valueTime, valueDateTime, or valuePeriod
		// These are all the things that it could be instead of valueQuantity, why. I don't understand why. But maybe this is the error you're getting, eventually need to do a regex search
		for (let obs of value){
			//we need to check this because if a component exists, all our numbers are in there
			getValueQuantities(obs, function(outsideValue,insideValue){
				if (String(insideValue.code.coding[0].code) === String(this.measureId)){
					var newArray = this.state.measurementList.slice();
					newArray.push({
	                    x:new Date(Date.parse(outsideValue.effectiveDateTime)),
	                    y:insideValue.valueQuantity.value});
					this.setState({measurementList:newArray});
			} 
			else if(String(obs.code.coding[0].code) === String(this.measureId)){
				var newArray = this.state.measurementList.slice();
					newArray.push({
	                    x:new Date(Date.parse(outsideValue.effectiveDateTime)),
	                    y:insideValue.valueQuantity.value});
					this.setState({measurementList:newArray});
			}
			}.bind(this));
		}

				console.log("before sending it: ", this.state.measurementList);


	}

	render(){
		if(this.state.measurementList){
			return (
			<div>			
				<PastGraph obs_data={this.state.measurementList}/>
			</div>
			)		
		}

		return <div>Loading...</div>
		
	}

}

export default MeasurementView;