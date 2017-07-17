import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import PastGraph from '../resources/PastGraph.js';

import { getValueQuantities } from '../utils/general_utils.js'

class MeasurementView extends Component {

	constructor(props){
		super(props);

		var measurements = this.props.measurements;
		
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
		}
	}

	getObservationByName(value){
		// valueQuantity, valueCodeableConcept, valueString, valueBoolean, valueRange, valueRatio, valueSampledData, valueAttachment, valueTime, valueDateTime, or valuePeriod
		// These are all the things that it could be instead of valueQuantity, why. I don't understand why. But maybe this is the error you're getting, eventually need to do a regex search
		this.measurementList = [];
		for (let obs of value){
			//we need to check this because if a component exists, all our numbers are in there
			getValueQuantities(obs, function(outsideValue,insideValue){
				if (String(insideValue.code.coding[0].code) === String(this.measureId)){
				this.measurementList.push({
                    x:new Date(Date.parse(outsideValue.effectiveDateTime)),
                    y:insideValue.valueQuantity.value});
			} 
			else if(String(obs.code.coding[0].code) === String(this.measureId)){
				this.measurementList.push({
                    x:new Date(Date.parse(outsideValue.effectiveDateTime)),
                    y:insideValue.valueQuantity.value});
			}
			}.bind(this));
		}
		console.log(" these are all the obs ------", this.measurementList);

	}

	render(){
		this.props.observations.then(this.getObservationByName.bind(this),function(err){this.measurementList=[];});
		return (
			<div>			
				<PastGraph obs_data={this.measurementList}/>
			</div>
		)
	}

}

export default MeasurementView;