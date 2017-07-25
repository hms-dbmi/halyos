import React, { Component } from 'react';

import {searchByCode} from '../utils/general_utils.js';
import $ from 'jquery'; 

class VitalTile extends Component {
	constructor(props) {
		super();
		this.state = {
			name: "",
			value: "Loading...",
			units: "",
		};
	}

	componentDidMount() {
		//var i = {this.props.i};
		var parentComponent = this;
		$.when(this.props.observations).done(function(obs) {
			var testobject = {};
			testobject[parentComponent.props.code] = [];
			var result = searchByCode(obs, testobject);
			var precision = 3;
			if (result[parentComponent.props.code][0]['value'] < 1) {
				precision = 2;
			}
			if (result[parentComponent.props.code][0]['text'] === "High Density Lipoprotein Cholesterol") {
				result[parentComponent.props.code][0]['text'] = "HDL Cholesterol";
			}
			if (result[parentComponent.props.code][0]['text'] === "Low Density Lipoprotein Cholesterol") {
				result[parentComponent.props.code][0]['text'] = "LDL Cholesterol";
			}
			var forSparkline = [];
			for(var i = 0; i < result[parentComponent.props.code].length; i++) {
				forSparkline.push({
					name: result[parentComponent.props.code][i]['date'].toString(),
					value: result[parentComponent.props.code][i]['value']
				})
			}
			parentComponent.setState({
				measurementName: result[parentComponent.props.code][0]['text'],
				units: result[parentComponent.props.code][0]['unit'],
				value: result[parentComponent.props.code][0]['value'].toPrecision(precision),
				data: forSparkline
			});
		});
	}
	render() {
		return (
			<div>
				<svg width="100%" height="100%" viewBox="0 0 690 106" version="1.1">
	    			<defs>
	        			<ellipse id="path-1" cx="49.6001408" cy="49.8750284" rx="49.6001408" ry="49.8750284"></ellipse>
	    			</defs>
				    <g id="Patient-Page" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				        <g id="Desktop-HD" transform="translate(-18.000000, -253.000000)">
				            <g id="Group-4" transform="translate(18.000000, 253.000000)">
				                <rect id="Rectangle-5" fillOpacity="0.9" fill="#AECEDA" x="0" y="0" width="690" height="106" rx="7.2"></rect>
			                	{this.props.children}
				                <text id="Weight" fontFamily="Helvetica" fontSize="30" fontWeight="normal" fill="#000000">
				                    <tspan x="110" y="38">{this.state.measurementName}</tspan>
				                </text>
				                <text id="150-lbs" fontFamily="HiraKakuPro-W3, Hiragino Kaku Gothic Pro" fontSize="40" fontWeight="300" fill="#000000">
				                    <tspan x="208" y="83">{this.state.value}</tspan>
				                    <tspan x="286.84" y="83" fontSize="32"> </tspan>
				                    <tspan x="297.496" y="83" fontSize="20">{this.state.units}</tspan>
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