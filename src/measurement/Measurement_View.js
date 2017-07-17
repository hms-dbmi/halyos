import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import PastGraph from '../resources/PastGraph.js';

import { getValueQuantities } from '../utils/general_utils.js'

class MeasurementView extends Component {

	constructor(props){
		super(props);

		var measurements = this.props.measurements;
		this.state = {measurementList:[], units:"", max:'', min:''};
	}
	
	componentWillMount(){
		if (this.props.match.params != null){
			this.measureId = this.props.match.params.measureId;	
		}
		
	}
	
	componentWillReceiveProps(nextProps){
		//console.log("next props", nextProps);
		if (this.props.match.params === null){
			return;
			
		}
		if (this.props.match.params.measureId !== nextProps.match.params.measureId){
			this.measureId = nextProps.match.params.measureId;
			this.setState({measurementList:[]});
			this.setState({units:"",max:'',min:''});
			nextProps.observations.then(this.getObservationByName.bind(this));

		}
	}

	componentDidMount(){
		this.props.observations.then(this.getObservationByName.bind(this));

	}

	getObservationByName(value){
		// valueQuantity, valueCodeableConcept, valueString, valueBoolean, valueRange, valueRatio, valueSampledData, valueAttachment, valueTime, valueDateTime, or valuePeriod
		// These are all the things that it could be instead of valueQuantity, why. I don't understand why. But maybe this is the error you're getting, eventually need to do a regex search
		var MAX_VAL = Number.NEGATIVE_INFINITY;
		var MIN_VAL = Number.POSITIVE_INFINITY;

		for (let obs of value){
			//we need to check this because if a component exists, all our numbers are in there
			getValueQuantities(obs, function(outsideValue,insideValue){
				if (String(insideValue.code.coding[0].code) === String(this.measureId)){
					//console.log("measurements: ", insideValue)
					
					if(MAX_VAL < insideValue.valueQuantity.value){
						MAX_VAL = insideValue.valueQuantity.value;
					}
					if (MIN_VAL > insideValue.valueQuantity.value){
						MIN_VAL = insideValue.valueQuantity.value;
					}
					// we just don't want to keep setting this value on every iteration of the loop through obs, so we check if its null first
					if (!this.state.units){
						this.setState({units:insideValue.valueQuantity.unit})
					}
					var newArray = this.state.measurementList.slice();
					newArray.push({
	                    x:new Date(Date.parse(outsideValue.effectiveDateTime)),
	                    y:insideValue.valueQuantity.value});
					this.setState({measurementList:newArray});
			} 
			else if(String(obs.code.coding[0].code) === String(this.measureId)){
					if(MAX_VAL < insideValue.valueQuantity.value){
						MAX_VAL = insideValue.valueQuantity.value;
					}
					if (MIN_VAL > insideValue.valueQuantity.value){
						MIN_VAL = insideValue.valueQuantity.value;
					}
				if (!this.state.units){
						this.setState({units:insideValue.valueQuantity.unit})
					}
				var newArray = this.state.measurementList.slice();
					newArray.push({
	                    x:new Date(Date.parse(outsideValue.effectiveDateTime)),
	                    y:insideValue.valueQuantity.value});
					this.setState({measurementList:newArray});
			}
			}.bind(this));
		}

				//console.log("before sending it: ", this.state.measurementList);


	}

	render(){
		if(this.state.measurementList){
			return (
			<div>			
				<PastGraph obs_data={this.state.measurementList} units={this.state.units} ymax={this.state.max} ymin={this.state.min}/>
			</div>
			)		
		}

		return <div>Loading...</div>
		
	}

}

export default MeasurementView;