import React, { Component } from 'react';
import $ from 'jquery'; 
import { searchByCode } from '../../services/risk_score_utils.js';
import {getNearest} from '../../services/general_utils.js';

class VitalTile extends Component {
	constructor(props) {
		super();
		this.state = {
			name: "",
			present: "",
			units: "",
			presentDate: ""
		};
	}

	componentDidMount() {
		//var i = {this.props.i};
		var parentComponent = this;
		$.when(this.props.observations).done(function(obs) {
			var testobject = {};
			testobject[parentComponent.props.code] = [];
			var result = searchByCode(obs, testobject);
			var precision = 0;
			if (result[parentComponent.props.code][0]['value'] < 1) {
				precision = 2;
			}
			if (result[parentComponent.props.code][0]['text'] === "High Density Lipoprotein Cholesterol") {
				result[parentComponent.props.code][0]['text'] = "HDL Cholesterol";
			}
			if (result[parentComponent.props.code][0]['text'] === "Low Density Lipoprotein Cholesterol") {
				result[parentComponent.props.code][0]['text'] = "LDL Cholesterol";
			}
			if (result[parentComponent.props.code][0]['text'] === "Systolic Blood Pressure") {
				result[parentComponent.props.code][0]['text'] = "Systolic BP";
			}
			if (result[parentComponent.props.code][0]['text'] === "Diastolic Blood Pressure") {
				result[parentComponent.props.code][0]['text'] = "Diastolic BP";
			}
			var forSparkline = [];
			for(var i = 0; i < result[parentComponent.props.code].length; i++) {
				forSparkline.push({
					name: result[parentComponent.props.code][i]['date'].toString(),
					value: (result[parentComponent.props.code][i]['value'])
				})
			}
			//console.log(result);
			parentComponent.setState({
				measurementName: result[parentComponent.props.code][0]['text'],
				present: result[parentComponent.props.code][0]['value'].toFixed(precision) + " " + result[parentComponent.props.code][0]['unit'],
				data: forSparkline,
				presentDate: "As of " + result[parentComponent.props.code][0]['date'].slice(0,10)
			});
		});
	}
	render() {
		var link = window.location.href + 'measure/' + this.props.code;
		pastMeasurement = getNearest(this.props.obs, 2015-01-01-00:00);
		this.setState({
			past: pastMeasurement.value,
			pastDate: pastMeasurement.effectiveDateTime
		});
		console.log(this.state.measurementName, 
			this.state.units, 
			this.state.past, 
			this.state.pastDate, 
			this.state.present, 
			this.state.presentDate, 
			this.state.future)
		return (
			<div>
				<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 750 180" version="1.1">
	    			<defs>
	        			<ellipse id="path-1" cx="49.6001408" cy="49.8750284" rx="49.6001408" ry="49.8750284"></ellipse>
	    			</defs>
					    <g id="Patient-Page" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
					        <g id="Desktop-HD" transform="translate(-18.000000, -253.000000)">
					            <g id="Group-4" transform="translate(18.000000, 253.000000)">
					                <text id="Weight" fontFamily="Helvetica" fontSize="56" fontWeight="normal" fill="#000000">
					                    <tspan x="180" y="56">{this.state.measurementName}</tspan>
					                </text>
					                <text id="150-lbs" fontFamily="HiraKakuPro-W3, Hiragino Kaku Gothic Pro" fontSize="45" fontWeight="300" fill="#000000">
					                    <tspan x="208" y="130">{this.state.value}</tspan>
					                    <tspan x="297.496" y="130" fontSize="20">{this.state.units}</tspan>
					                    <tspan x= "470" y="170" fontSize="30">{this.state.date}</tspan>
					                </text>
					                <foreignObject width = "300px" height = "224px" x = "450px" y="40px">
				                        
									</foreignObject>
					            </g>
					        </g>
					    </g>
				</svg>
			</div>
		)
	}
}

export default VitalTile;