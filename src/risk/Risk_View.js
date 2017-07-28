import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import MeasurementCard from './MeasurementCard.js';
import RelevantConditions from './Relevant_Conditions.js';

import { getValueQuantities, searchByCode, pullCondition } from '../utils/general_utils.js';

import Slider, { Range } from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';


const riskObject = {
        "General_Cardiac": ["30522-7", "2093-3", "2085-9", "8480-6"],
        "Stroke": [],
        "Kidney_Failure": ["48643-1", "48642-3", "33914-3","14958-3", "14959-1"],
        "COPD_Mortality": ["8480-6", "8462-4","6299-2","9279-1"],
        "Diabetes": ["56115-9", "56114-2", "56117-5", "8280-0", "8281-8","39156-5"]
    };

class RiskView extends Component {

	constructor(props){
		super(props);
		this.state = {obsByMeasurement:{}, allObs:{}};
	}
	
	componentWillMount(){
		if (this.props.match.params != null){
			this.riskName = this.props.match.params.riskName;	
		}
		console.log("NAME", this.riskName);
		
	}
	
	componentWillReceiveProps(nextProps){
		this.tempNextRiskData = {};
		//this.riskName = nextProps.match.params.riskName;
//		console.log("next props", this.riskName);
		if (this.props.match.params === null){
			return;
		}

//		console.log("this.riskName now: ", this.riskName);
//		console.log("nextProps.match.params.riskName", nextProps.match.params.riskName);


		if (this.riskName !== nextProps.match.params.riskName){
			this.riskName = nextProps.match.params.riskName;

			//makes sure to use the already gotten observation data if we have it.
			//console.log("what is happening----------------------------------------", this.state.allObs);
			if(!this.isEmpty(this.state.allObs)) {
//				console.log("state.allObs", this.state.allObs);
				this.setState({obsByMeasurement:{}});
				this.tempNextRiskData = this.addResultsToObsByMeasurement(this.state.allObs);
//				console.log("about to get auxiliary");
				this.getAuxiliaryInfo(this.tempNextRiskData);
				//this.getObservationByName(this.state.obs)	
			} 
			else {
				nextProps.observations
					.then(this.setInitialAllObs.bind(this))
					.then(this.addResultsToObsByMeasurement.bind(this))
					.then(this.getAuxiliaryInfo.bind(this));
			}
		}
	}

	componentDidMount(){
		this.props.observations
			.then(this.setInitialAllObs.bind(this))
			.then(this.addResultsToObsByMeasurement.bind(this))
			.then(this.getAuxiliaryInfo.bind(this));

	}



	setInitialAllObs(value){
		this.setState({allObs:value});
		return value;
	}

	addResultsToObsByMeasurement(value){
//		console.log("what is the value: ", value);
//		console.log("what is the risk name: ", this.riskName);
		var codeList = riskObject[this.riskName];
		var obsObject = {};
		for(let code of codeList){
			obsObject[code] = [];
		}
		searchByCode(value, obsObject);

		this.graphComponentsByMeasurement = {};

		for (var key in obsObject) {
			if (obsObject.hasOwnProperty(key)) {
				this.graphComponentsByMeasurement[key.toString()] = {code:key.toString(),results:obsObject[key]}				    
			}
		}
//		console.log("graphComponentsByMeasurement1: ", this.graphComponentsByMeasurement);

		// if(!this.isEmpty(this.state.allObs)){
		// 	console.log("made it inside the addResultsToObsByMeasurement and if statement:");
		// 	this.setState({obsByMeasurement:graphComponentsByMeasurement},this.getAuxiliaryInfo());	
		// 	//this.forceUpdate();
		// }
		return this.graphComponentsByMeasurement;
//		console.log("graphComponentsByMeasurement2: ", this.state.obsByMeasurement);

	}

	getAuxiliaryInfo(intermediateObsByMeasurement){
//		console.log("intermediateObsByMeasurement", intermediateObsByMeasurement);
		var test = intermediateObsByMeasurement;
//		console.log("i guess test: ", test);
		Object.keys(test).map(function(key){
			//console.log("this inside a functioN: ", this.state);
			this.getRefRangeByMeasurement(test[key]);
			this.getMinAndMaxByMeasurement(test[key]);
			this.getUnitsByMeasurement(test[key]);
			this.addDataByMeasurement(test[key]);
		}, this);

		this.setState({obsByMeasurement:test})
		
//		console.log("back in auxiliary state", test);
				
				
	//console.log("this is it yo: ", this.state.obsByMeasurement);
	//this.getMinAndMaxByMeasurement(this.state.obsByMeasurement[key]);

	}


	getMinAndMaxByMeasurement(codeObject){
		var resultList = codeObject.results;
		var tempObj = this.state.obsByMeasurement;
		var codeObjectTemp = codeObject;
		
		var minVal = Number.POSITIVE_INFINITY;
		var maxVal = Number.NEGATIVE_INFINITY;

		for (let result of resultList){			
			if(maxVal < result.value){
				maxVal = result.value;
			}
			if (minVal > result.value){
				minVal = result.value;
			}
		}
			
		codeObjectTemp['min'] = (minVal === Number.POSITIVE_INFINITY) ? null : minVal;
		codeObjectTemp['max'] = (maxVal === Number.NEGATIVE_INFINITY) ? null : maxVal;
		tempObj[codeObjectTemp.code] = codeObjectTemp;
		//this.setState({obsByMeasurement:tempObj});
	}

	//gets the reference ranges for each code if there are any and add them to the state, if not add []
	getRefRangeByMeasurement(codeObject){

		var resultList = codeObject.results;
		var tempObj = this.state.obsByMeasurement;
		var codeObjectTemp = codeObject;
		
		for (let result of resultList){			
			if(result.refRanges !== undefined){
				for(let refRange of result.refRanges){
					if ((!refRange.type) || (refRange.type.coding[0].code === "normal")) {
						codeObjectTemp['refRange'] = [refRange.low.value, refRange.high.value];
						return;
					}
				} 
			}
		}
			
		codeObjectTemp['refRange'] = [];			
		tempObj[codeObjectTemp.code] = codeObjectTemp;				
		//this.setState({obsByMeasurement:tempObj});
	}
	
	getUnitsByMeasurement(codeObject){
		var resultList = codeObject.results;
		var tempObj = this.state.obsByMeasurement;
		var codeObjectTemp = codeObject;

		for (let result of resultList){
			if(result.unit){
				codeObjectTemp['units'] = result.unit;
				return;
			}
		}

		codeObjectTemp['units'] = null;			
		tempObj[codeObjectTemp.code] = codeObjectTemp;				
		//this.setState({obsByMeasurement:tempObj});
	}

	addDataByMeasurement(codeObject){
		var resultList = codeObject.results;
		var tempObj = this.state.obsByMeasurement;
		var codeObjectTemp = codeObject;

		var dataTempObj = [];
		for (let result of resultList){
				var tmpDate = Date.parse(result.date);
				//sometimes the date doesn't get parsed right :(
				if (!isNaN(tmpDate)){
					dataTempObj.push({x:tmpDate,y:result.value});	
				}
				
		}

		codeObjectTemp['data'] = dataTempObj;			
		tempObj[codeObjectTemp.code] = codeObjectTemp;				
		//this.setState({obsByMeasurement:tempObj});
	}

/**
	
	Creates
*/
/**
	getObservationByName(value){
		this.setState({obs:value});
		// valueQuantity, valueCodeableConcept, valueString, valueBoolean, valueRange, valueRatio, valueSampledData, valueAttachment, valueTime, valueDateTime, or valuePeriod
		// These are all the things that it could be instead of valueQuantity, why. I don't understand why. But maybe this is the error you're getting, eventually need to do a regex search
		this.MAX_VAL = Number.NEGATIVE_INFINITY;
		this.MIN_VAL = Number.POSITIVE_INFINITY;

		this.referenceRange = [];
    
		for (let obs of value){

			//we need to check this because if a component exists, all our numbers are in there
			//the insideValue and outsideValue can be the same if there are no components (basically everything except BP) and if there is a component then they are different objects and the innerValue is the one actual measurement
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
*/

	isEmpty(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}

	render(){

		//console.log('render');
		if(!this.isEmpty(this.state.obsByMeasurement)){
			return (
				<div>
					{
						Object.keys(this.state.obsByMeasurement).map(function(key){
							console.log("we are checking for each thing data:", this.state.obsByMeasurement[key].data)
							var hasNoData = (this.state.obsByMeasurement[key].data === undefined) || 
											(this.state.obsByMeasurement[key].data.length == 0);
							//console.log(".data", this.state.obsByMeasurement[key].data);
							//console.log("isEmpty:", hasNoData);
							if(!hasNoData){
								return <MeasurementCard key={key}
									data={this.state.obsByMeasurement[key].data}
									units={this.state.obsByMeasurement[key].units}
									name={this.state.obsByMeasurement[key].code}
									/>	
							} else {
								return
							}
							
					}, this)
				}
				<RelevantConditions riskName={this.riskName} conditions={this.props.conditions}/>		
				</div>
			)
		
		}

		return <div>Loading...</div>
		
	}

}

export default RiskView;