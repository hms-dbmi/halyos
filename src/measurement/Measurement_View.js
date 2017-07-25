import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import PastGraph from '../resources/PastGraph.js';
import PastToFutureGraph from '../resources/Past-to-Future-Graph.js';

import { getValueQuantities } from '../utils/general_utils.js'

import {ReynoldsScore, CHADScore, KFScore, COPD, Diabetes, RiskTile} from '../profile/Profile_View.js';

class MeasurementView extends Component {

	constructor(props){
		super(props);
		this.state = {measurementList:[], units:"", max:'', min:'', name: ''};
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
		this.MAX_VAL = Number.NEGATIVE_INFINITY;
		this.MIN_VAL = Number.POSITIVE_INFINITY;

		this.referenceRange = [];

		for (let obs of value){

			//we need to check this because if a component exists, all our numbers are in there
			getValueQuantities(obs, function(outsideValue,insideValue){
				if (String(insideValue.code.coding[0].code) === String(this.measureId)){
					this.setState({
						name: insideValue.code.text
					});
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
			else if(String(obs.code.coding[0].code) === String(this.measureId)){
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
		  	console.log(this.props);
			return (
				<div>
					<div className="row">
						<div className="col-md-6">	
							<PastGraph obs_data={this.state.measurementList} units={this.state.units}/>
						</div>
						<div className="col-md-6">
							<MeasurementText measurementName={this.state.name}/>
						</div>
					</div>
					<div className="row">
					<svg width="100%" height="50px">
							<text fontSize="20" fontFamily="HiraKakuStd-W8, Hiragino Kaku Gothic Std">
								<tspan x="22" y="36">Risk Scores Affected By This Measurement</tspan>
							</text>
					</svg>
						<div className="row">
							{this.props.riskObject['General Cardiac'].includes(this.measureId) &&
								<div className="col-md-2">
			        			<RiskTile scoreName="General Cardiac"><ReynoldsScore pt={this.props.patient} obs={this.props.observations}/></RiskTile>
								</div>	
							}
							{this.props.riskObject['Kidney Failure'].includes(this.measureId) &&
								<div className="col-md-2">
			        			<RiskTile scoreName="Kidney Failure"><KFScore pt={this.props.patient} obs={this.props.observations}/></RiskTile>
								</div>	
							}
							{this.props.riskObject['COPD Mortality'].includes(this.measureId) &&
								<div className="col-md-2">
			        			<RiskTile scoreName="COPD Mortality"><COPD pt={this.props.patient} obs={this.props.observations} conds={this.props.conditions}/></RiskTile>
								</div>	
							}
							{this.props.riskObject['Diabetes'].includes(this.measureId) &&
								<div className="col-md-2">
			        			<RiskTile scoreName="Diabetes"><Diabetes pt={this.props.patient} obs={this.props.observations} conds={this.props.conditions} medreq={this.props.medreq}/></RiskTile>
								</div>	
							}
						</div>
					</div>
				</div>
			)		
		}

		return <div>Loading...</div>
		
	}

}

class MeasurementText extends Component {
	constructor(props) {
		super();
	}

	render() {
		return (
			<div>
				<text x='10' y='50' style={{fontSize: 38, fontFamily:"HiraKakuStd-W8, Hiragino Kaku Gothic Std", color:"#18A9DC"}}>
					About This Measurement <br/> 
				</text>
				<text style={{fontSize: 16, fontFamily:"HiraKakuStd-W8, Hiragino Kaku Gothic Std", color:"black"}}>
					What does my {this.props.measurementName} mean?
				</text>
			</div>
		);
	}
}

export default MeasurementView;