import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import PastGraph from '../resources/PastGraph.js';
import PastToFutureGraph from '../resources/Past-to-Future-Graph.js';

import { getValueQuantities } from '../utils/general_utils.js'

class RiskView extends Component {

	constructor(props){
		super(props);
		this.state = {measurementList:[], units:"", max:'', min:''};
	}
	
	componentWillMount(){
		if (this.props.match.params != null){
			this.riskName = this.props.match.params.riskName;	
		}
		
	}
	
	componentWillReceiveProps(nextProps){
		//console.log("next props", nextProps);
		if (this.props.match.params === null){
			return;
			
		}
		if (this.props.match.params.riskName !== nextProps.match.params.riskName){
			this.riskName = nextProps.match.params.riskName;
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
		this.MAX_VAL = Number.NEGATIVE_INFINITY;
		this.MIN_VAL = Number.POSITIVE_INFINITY;

		this.referenceRange = [];
		console.log("refs: ", value);

		for (let obs of value){

			//we need to check this because if a component exists, all our numbers are in there
			getValueQuantities(obs, function(outsideValue,insideValue){
				if (String(insideValue.code.coding[0].code) === String(this.riskName)){

					//currently only looks for normal ranges
					if(obs.referenceRange){
						for(let refRange of obs.referenceRange){
								if ((refRange.type.coding[0].code === "normal") ||
									(!refRange.type)){
									this.referenceRange.push([refRange.low.value, refRange.high.value]);
								}
							} 
					}
			
					//gets the max and min values as we add them to the measurementList		
					if(this.MAX_VAL < insideValue.valueQuantity.value){
						this.MAX_VAL = insideValue.valueQuantity.value;
					}
					if (this.MIN_VAL > insideValue.valueQuantity.value){
						this.MIN_VAL = insideValue.valueQuantity.value;
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
			else if(String(obs.code.coding[0].code) === String(this.riskName)){
					if(this.MAX_VAL < insideValue.valueQuantity.value){
						this.MAX_VAL = insideValue.valueQuantity.value;
					}
					if (this.MIN_VAL > insideValue.valueQuantity.value){
						this.MIN_VAL = insideValue.valueQuantity.value;
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

	}

	render(){
		if(this.state.measurementList.length > 0){
	
			this.FUTURE_MONTH_ADDITION = 6;
			var lastMeasurementDate = this.state.measurementList[0].x;
			var futureMeasurementDate = new Date(lastMeasurementDate).setMonth(lastMeasurementDate.getMonth() + this.FUTURE_MONTH_ADDITION);
			var lastDataPoint = this.state.measurementList[0].y;

			var dateList = [];
			for (let item of this.state.measurementList){
				dateList.push(item.x);
			}

			dateList.sort();
			var firstDate = dateList[0].getFullYear();
			var lastDate = dateList[dateList.length-1].getFullYear();

		  	//console.log(" first and last date in measurement view--------", firstDate, lastDate);

		  	console.log("this is reference: ", this.referenceRange);
			return (
			<div>			
				<PastToFutureGraph 
					obs_data={this.state.measurementList} 
					units={this.state.units} 
					futureMeasurementDate={futureMeasurementDate} 
					lastDataPoint={lastDataPoint}
					yMax={this.MAX_VAL}
					yMin={this.MIN_VAL}
					firstYear={firstDate}
					lastYear={lastDate}
					refRange={this.referenceRange}

				 />
				 <PastToFutureGraph 
					obs_data={this.state.measurementList} 
					units={this.state.units} 
					futureMeasurementDate={futureMeasurementDate} 
					lastDataPoint={lastDataPoint}
					yMax={this.MAX_VAL}
					yMin={this.MIN_VAL}
					firstYear={firstDate}
					lastYear={lastDate}
					refRange={this.referenceRange}

				 />
				 <PastToFutureGraph 
					obs_data={this.state.measurementList} 
					units={this.state.units} 
					futureMeasurementDate={futureMeasurementDate} 
					lastDataPoint={lastDataPoint}
					yMax={this.MAX_VAL}
					yMin={this.MIN_VAL}
					firstYear={firstDate}
					lastYear={lastDate}
					refRange={this.referenceRange}

				 />
			</div>
			)		
		}

		return <div>Loading...</div>
		
	}

}

export default RiskView;