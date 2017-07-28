import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import PastGraph from '../resources/PastGraph.js';
import PastToFutureGraph from '../resources/Past-to-Future-Graph.js';

import { getValueQuantities } from '../utils/general_utils.js';

import {ReynoldsScore, CHADScore, KFScore, COPD, Diabetes, RiskTile} from '../RiskCalculators/Risk_Components.js';
import text from './Measurement_Text.js';

class MeasurementView extends Component {

	constructor(props){
		super(props);
		this.state = {measurementList:[], units:"", max:'', min:'', name: '', allObs:{}};
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
			if (this.isEmpty(this.state.allObs)){
				nextProps.observations.then(this.getObservationByName.bind(this));
				console.log("its empty! should only happen once :(");
			} 
			else {
				this.getObservationByName(this.state.allObs);
				console.log("its not! use the same shit");
			}
			

		}
	}

	componentDidMount(){
		if (this.isEmpty(this.state.allObs)){
			this.props.observations.then(this.getObservationByName.bind(this));	
			console.log("its empty! should only happen once :(");

		} 
		else {
			this.getObservationByName(this.state.allObs);
			console.log("its not! use the same shit");

		}
	}

	setInitialAllObs(value){
		this.setState({allObs:value});
		return value;
	}

	isEmpty(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}

	getObservationByName(value){

		if(this.isEmpty(this.state.allObs)){
			this.setInitialAllObs(value);
		}
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
		return 
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
			return (
				<div>
					<div className="row">
						<div className="col-md-6">	
							<PastGraph obs_data={this.state.measurementList} units={this.state.units} mainWidth={500}
							mainHeight={200}
							viewWidth={500}
							viewHeight={50}/>
							<text style={{fontSize: "20", fontFamily: "HiraKakuStd-W8, Hiragino Kaku Gothic Std"}}>
								Risk Scores Affected By This Measurement
							</text>
							<div className="row">
								{this.props.riskObject['General Cardiac'].includes(this.measureId) &&
									<div className="col-md-4">
				        			<RiskTile scoreName="General Cardiac"><ReynoldsScore pt={this.props.patient} obs={this.props.observations}/></RiskTile>
									</div>	
								}
								{this.props.riskObject['Kidney Failure'].includes(this.measureId) &&
									<div className="col-md-4">
				        			<RiskTile scoreName="Kidney Failure"><KFScore pt={this.props.patient} obs={this.props.observations}/></RiskTile>
									</div>	
								}
								{this.props.riskObject['COPD Mortality'].includes(this.measureId) &&
									<div className="col-md-4">
				        			<RiskTile scoreName="COPD Mortality"><COPD pt={this.props.patient} obs={this.props.observations} conds={this.props.conditions}/></RiskTile>
									</div>	
								}
								{this.props.riskObject['Diabetes'].includes(this.measureId) &&
									<div className="col-md-4">
				        			<RiskTile scoreName="Diabetes"><Diabetes pt={this.props.patient} obs={this.props.observations} conds={this.props.conditions} medreq={this.props.medreq}/></RiskTile>
									</div>	
								}
							</div>
						</div>
						<div className="col-md-6">
							<MeasurementText measurementName={this.state.name} measurementCode={this.measureId}/>
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
		this.state = {
			meaning: "Loading...",
			important: "Loading...",
			improve: "Loading..."
		};
	}

	componentDidMount() {
		console.log(this.props.measurementCode);
		console.log("Measurementment Text", text['text']);
		if(text['text'][this.props.measurementCode]) {
			this.setState({
			meaning: text['text'][this.props.measurementCode].meaning,
			important: text['text'][this.props.measurementCode].important,
			improve: text['text'][this.props.measurementCode].improve
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log("HIYA!", this.props);
		if(text['text'][nextProps.measurementCode]) {
			this.setState({
			meaning: text['text'][nextProps.measurementCode].meaning,
			important: text['text'][nextProps.measurementCode].important,
			improve: text['text'][nextProps.measurementCode].improve
			});
		}
		else {
			this.setState({
				meaning: "No data available. Please consult your doctor.",
				important: "No data available. Please consult your doctor.",
				improvec: "No data available. Please consult your doctor."
			});
		}
	}

	render() {
		return (
			<div>
				<text x='10' y='50' style={{fontSize: 38, fontFamily:"HiraKakuStd-W8, Hiragino Kaku Gothic Std", color:"#18A9DC"}}>
					About This Measurement <br/> 
				</text>
				<text style={{fontSize: 16, fontFamily:"HiraKakuStd-W8, Hiragino Kaku Gothic Std", color:"black"}}>
					What does my {this.props.measurementName} mean? <br/>
				</text>
				<text style={{fontSize: 12, fontFamily:"HiraKakuPro-W3, Hiragino Kaku Gothic Pro", color:"black"}}>
					{this.state.meaning} <br/>
				</text>
				<text style={{fontSize: 16, fontFamily:"HiraKakuStd-W8, Hiragino Kaku Gothic Std", color:"black"}}>
					Why is my {this.props.measurementName} important? <br/>
				</text>
				<text style={{fontSize: 12, fontFamily:"HiraKakuPro-W3, Hiragino Kaku Gothic Pro", color:"black"}}>
					{this.state.important} <br/>
				</text>
				<text style={{fontSize: 16, fontFamily:"HiraKakuStd-W8, Hiragino Kaku Gothic Std", color:"black"}}>
					How can I make it better? <br/>
				</text>
				<text style={{fontSize: 12, fontFamily:"HiraKakuPro-W3, Hiragino Kaku Gothic Pro", color:"black"}}>
					{this.state.improve} <br/>
				</text>
			</div>
		);
	}
}

export default MeasurementView;