import React, { Component } from 'react';
import Scale from '../logos/scale';
import BP from '../logos/bp';
import $ from 'jquery'; 
import {getTopObservations, getTopObservationsDemo, SparklinesReferenceLine} from '../utils/patient_view_utils.js'
import {searchByCode} from '../utils/general_utils.js';
import { LineChart, Line, Tooltip } from 'recharts';
var Sparkline = require('react-sparkline');

class ProfileView extends Component {
	constructor(props){
		super(props);
		//This is how you refer to function clients passed through frmo the App.js

		/*this.search = this.props.client.api.search;
		this.search({type: "Observation", query: {subject: "99912345"}})
      			.then(function(r){
        			console.log("alsjdhfalsdkfjhalsdfjhasldfkjasldfajshd ",JSON.stringify(r,null,2));
	    		});
		*/
	}
	render(){ //Known issue; the code can easily be changed, the icon not so much....
		console.log(this.props);
		return (
			<div>
				<div className = "col-md-6">
					<DemographicTile patient={this.props.patient} observations={this.props.observations} encounters={this.props.encounters}/>
					<VitalTile code='29463-7' observations={this.props.observations}><Scale/></VitalTile>
					<VitalTile code='8480-6' observations={this.props.observations}><BP/></VitalTile>
					<VitalTile code='8462-4' observations={this.props.observations}><BP/></VitalTile>
					<VitalTile code='2085-9' observations={this.props.observations}><Scale/></VitalTile>
					<VitalTile code='18262-6' observations={this.props.observations}><Scale/></VitalTile>
					<VitalTile code='2339-0' observations={this.props.observations}><BP/></VitalTile>
				</div>
				<div className = "col-md-6">
					<MedicationTile meds={this.props.meds}/>
				</div>
			</div>

		)
	}

}

function getPatientName (pt) {
  if (pt.name) {
    var names = pt.name.map(function(name) {
      return name.given.join(" ") + " " + name.family;
    });
    return names[0];
  } else {
    return "anonymous";
  }
}

class MedicationTile extends Component {
	constructor(props) {
		super();
		this.state = {
			medList: {},
			medListText: ""
		};
	}

	componentDidMount() {
		var parentComponent = this;
		console.log("Component mounted");
		$.when(this.props.meds).done(function(meds) {
			console.log("Drugs", meds);
			const medNames = [];
			for (var i = 0; i < meds.length; i++) {
				medNames.push(meds[i].medicationCodeableConcept.text + ": " + meds[i].dosage[0].text);
			}
			const listItems = medNames.map((medName) =>
	  			<li>{medName}</li>
			);
			parentComponent.setState({
				medListText: listItems
			});
		});
	}

	render() {
		return (
			<div>
				<svg width="100%" height="100%" viewBox="0 0 610 150" version="1.1">
				    <defs>
				        <linearGradient x1="51.7971499%" y1="47.5635228%" x2="52.4921324%" y2="48.1654036%" id="linearGradient-1">
				            <stop stopColor="#9198A1" offset="0%"></stop>
				            <stop stopColor="#888D95" offset="100%"></stop>
				        </linearGradient>
				        <rect id="path-2" x="0" y="0" width="610" height="150" rx="7.2"></rect>
				    </defs>
				    <g id="Patient-Page" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				        <g id="Desktop-HD" transform="translate(-732.000000, -106.000000)">
				            <g id="Medications" transform="translate(732.000000, 106.000000)">
				                <g id="Rectangle-7">
				                    <use fillOpacity="0.55" fill="url(#linearGradient-1)" fillRule="evenodd" xlinkHref="#path-2"></use>
				                </g>
				                <foreignObject width="650px" height="150px" x="10" y="49">
				                	<div style={{fontSize: "18px"}}><ul style={{listStyleType: 'none'}}>{this.state.medListText}</ul></div>
				                </foreignObject>
				                <text id="Medication-Reminders" fontFamily="Helvetica" fontSize="32" fontWeight="normal" fill="#000000">
				                    <tspan x="165" y="39">Medication Reminders</tspan>
				                </text>
				            </g>
				        </g>
				    </g>
				</svg>
			</div>
		);
	}
}

class DemographicTile extends Component {
	constructor(props) {
		super();
		this.state = {
			name: "",
			genderheight: "",
			dob: "",
			lastencounter:""
		};
	}

	componentDidMount() {
		//var i = {this.props.i};
		var parentComponent = this;
		$.when(this.props.patient, this.props.observations, this.props.encounters).done(function(pt, obs, encs) {
			var genderheightstring = pt[0].gender.charAt(0).toUpperCase() + pt[0].gender.slice(1);
			var heightObject = searchByCode(obs, {'8302-2': []})['8302-2'][0];
			console.log("Height!", heightObject);
			if(heightObject) {
				genderheightstring += (' -- ' + heightObject.value.toFixed(2) + " " + heightObject.unit);
			}
			parentComponent.setState({
				name: getPatientName(pt[0]),
				genderheight: genderheightstring,
				dob: "DOB: " + pt[0].birthDate
				// lastencounter: ""
			});
		});
	}

	render() {
		return (
			<div>
				<h2 className="text-center">{this.state.name}</h2>
				<h4 className="text-center">{this.state.genderheight}</h4>
				<h4 className="text-center">{this.state.dob}</h4>
			</div>
		);
	}
}


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
			var forSparkline = [];
			for(var i = 0; i < result[parentComponent.props.code].length; i++) {
				forSparkline.push({
					name: result[parentComponent.props.code][i]['date'].toString(),
					value: (result[parentComponent.props.code][i]['value'])
				})
			}
			parentComponent.setState({
				measurementName: result[parentComponent.props.code][0]['text'],
				value: result[parentComponent.props.code][0]['value'].toFixed(precision) + " " + result[parentComponent.props.code][0]['unit'],
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

export default ProfileView;