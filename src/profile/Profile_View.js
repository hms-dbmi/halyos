import React, { Component } from 'react';
import Scale from '../logos/scale';
import BP from '../logos/bp';
import Cholesterol from '../logos/chol';
import Glucose from '../logos/glucose';
import $ from 'jquery'; 
import {getTopObservations, getTopObservationsDemo, SparklinesReferenceLine} from '../utils/patient_view_utils.js'
import {searchByCode, calculateAge, pullCondition} from '../utils/general_utils.js';
import { LineChart, Line, Tooltip } from 'recharts';
import EnvironmentTile from './EnvironmentFactors.js';
import {Diabetes, COPD, KFScore, CHADScore, ReynoldsScore, RiskTile, HelpRiskTile} from '../RiskCalculators/Risk_Components.js';
import { Button } from 'react-bootstrap';
import Dialog from 'react-bootstrap-dialog'

class ProfileView extends Component {
	constructor(props){
		super(props);
	}

	render(){ //Known issue; the code can easily be changed, the icon not so much....
		return (
			<div>
				<div className="row">
					<div className = "col-sm-6">
						<div className="row">
							<div className="col-sm-12">
								<DemographicTile patient={this.props.patient} observations={this.props.observations} encounters={this.props.encounters}/><br/>
							</div>
								<div className="col-sm-6">
									<VitalTile code='29463-7' observations={this.props.observations}><Scale/></VitalTile>
								</div>
								<div className="col-sm-6">
									<VitalTile code='2085-9' observations={this.props.observations}><Cholesterol/></VitalTile>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-6">
									<VitalTile code='8480-6' observations={this.props.observations}><BP/></VitalTile>
								</div>
								<div className="col-sm-6">
									<VitalTile code='18262-6' observations={this.props.observations}><Cholesterol/></VitalTile>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-6">
									<VitalTile code='8462-4' observations={this.props.observations}><BP/></VitalTile>
								</div>
								<div className="col-sm-6">
									<VitalTile code='2339-0' observations={this.props.observations}><Glucose/></VitalTile>
								</div> 
						</div>
					</div>
					<div className = "col-sm-6">
						<MedicationTile meds={this.props.meds}/>
						<EnvironmentTile patient={this.props.patient}/>
						<AppointmentsTile patient={this.props.patient}/>
					</div>
				</div>
				<div className="row">
					<div className = "col-sm-2">
						<div><RiskTile scoreName="General Cardiac"><ReynoldsScore pt={this.props.patient} obs={this.props.observations}/></RiskTile></div>
					</div>
					<div className = "col-sm-2">
						<div><RiskTile scoreName="Stroke"><CHADScore pt={this.props.patient} conds={this.props.conditions}/></RiskTile></div>
					</div>
					<div className = "col-sm-2">
						<div><RiskTile scoreName="Kidney Failure"><KFScore pt={this.props.patient} obs={this.props.observations}/></RiskTile></div>
					</div>
					<div className = "col-sm-2">
						<div><RiskTile scoreName="COPD Mortality"><COPD pt={this.props.patient} obs={this.props.observations} conds={this.props.conditions}/></RiskTile></div>
					</div>
					<div className = "col-sm-2">
						<div><RiskTile scoreName="Diabetes"><Diabetes pt={this.props.patient} obs={this.props.observations} conds={this.props.conditions} medreq={this.props.medreq}/></RiskTile></div>
					</div>
			
					<div className = "col-sm-2">
						<div><HelpRiskTile scoreName="Help"/></div>
					</div>
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
		$.when(this.props.meds).done(function(meds) {
			const medNames = [];
			if(meds) {
				for (var i = 0; i < meds.length; i++) {
					medNames.push(meds[i].medicationCodeableConcept.text + ": " + meds[i].dosage[0].text);
				}
				const listItems = medNames.map((medName) =>
		  			<li key={medName}>{medName}</li>
				);
				parentComponent.setState({
					medListText: listItems
				});
			}
		});
	}

	render() {
		return (
			<div>
				<svg width="100%" height="100%" viewBox="0 0 610 96" version="1.1">
				    <defs>
				        <linearGradient x1="51.7971499%" y1="47.5635228%" x2="52.4921324%" y2="48.1654036%" id="linearGradient-1">
				            <stop stopColor="#9198A1" offset="0%"></stop>
				            <stop stopColor="#888D95" offset="100%"></stop>
				        </linearGradient>
				        <rect id="path-2" x="0" y="0" width="610" height="96" rx="7.2"></rect>
				    </defs>
				    <g id="Patient-Page" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				        <g id="Desktop-HD" transform="translate(-732.000000, -106.000000)">
				            <g id="Medications" transform="translate(732.000000, 106.000000)">
				                <g id="Rectangle-7">
				                    <use fillOpacity="0.55" fill="url(#linearGradient-1)" fillRule="evenodd" xlinkHref="#path-2"></use>
				                </g>
				                <foreignObject width="650px" height="96px" x="0" y="26">
				                	<div style={{fontSize: "18px"}}><ul style={{listStyleType: 'none'}}>{this.state.medListText}</ul></div>
				                </foreignObject>
				                <text x="50%" y="20%" alignmentBaseline="middle" textAnchor="middle" id="Medication-Reminders" fontFamily="Helvetica" fontSize="20" fontWeight="normal" fill="#000000">
				                    Medication Reminders
				                </text>
				            </g>
				        </g>
				    </g>
				</svg>
			</div>
		);
	}
}

class AppointmentsTile extends Component {
	constructor(props) {
		super();
		this.state = {
			interventionsList: ""
		};
	}

	componentDidMount() {
		console.log(this.props.patient)
		var parentComponent = this;
		$.when(this.props.patient).done(function(pt){
			var age = calculateAge(pt[0].birthDate);
			var gender = pt[0].gender;
			var URL = 'https://healthfinder.gov/api/v2/myhealthfinder.json?api_key=fwafjtozprnxlbbb&age=' + age + "&sex=" + gender;
			$.get(URL).done(function(data) {
				console.log(data);
				var interventions = [];
				for(var i = 0; i < data.Result.Resources.All.Resource.length; i++) {
					interventions.push(data.Result.Resources.All.Resource[i].MyHFDescription);
				}
				const listItems = interventions.map((int) =>
		  			<li key={int}>{int}</li>
				);
				parentComponent.setState({
					interventionsList: listItems
				});
			});
		});
	}

	render() {
		return (
			<div>
				<p style={{textAlign: 'center', fontSize: "20"}}>
					Suggested Preventative Care for You
				</p>
				<div style={{height:'100px',width:'100%',border:'1px solid #ccc',font:'16px/26px Georgia, Garamond, Serif',overflow:'auto'}}>
					<ul>{this.state.interventionsList}</ul>
				</div>
			</div>
		);
	}
}

class OldAppointmentsTile extends Component {
	constructor(props) {
		super();
	}

	componentDidMount() {

	}

	render() {
		return (
			<iframe src="https://calendar.google.com/calendar/embed?title=Appointments&amp;showTitle=0&amp;showTabs=0&amp;showCalendars=0&amp;mode=AGENDA&amp;height=132&amp;wkst=1&amp;bgcolor=%23ffffff&amp;src=samson.mataraso%40berkeley.edu&amp;color=%23182C57&amp;ctz=America%2FLos_Angeles" style={{borderWidth:0}} width="610" height="132" frameborder="0" scrolling="no"></iframe>
		);
	}
}

class DemographicTile extends Component {
	constructor(props) {
		super();
		this.state = {
			name: "Loading...",
			genderheight: "Loading...",
			dob: "Loading...",
			lastencounter:"Loading..."
		};
	}

	componentDidMount() {
		//var i = {this.props.i};
		var parentComponent = this;
		$.when(this.props.patient, this.props.observations, this.props.encounters).done(function(pt, obs, encs) {
			var genderheightstring = pt[0].gender.charAt(0).toUpperCase() + pt[0].gender.slice(1);
			var heightObject = searchByCode(obs, {'8302-2': []})['8302-2'][0];
			if(heightObject) {
				genderheightstring += (' -- ' + heightObject.value.toFixed(2) + " " + heightObject.unit);
			}
			parentComponent.setState({
				name: getPatientName(pt[0]),
				genderheight: genderheightstring,
				dob: "DOB: " + pt[0].birthDate,
				lastencounter: "Last Hospital Visit: " + encs[0].period.end.substring(0,10)
			});
		});
	}

	render() {
		return (
			<div>
				<h2 className="text-center">{this.state.name}</h2>
				<h4 className="text-center">{this.state.genderheight}</h4>
				<h4 className="text-center">{this.state.dob}</h4>
				<h4 className="text-center">{this.state.lastencounter}</h4>
			</div>
		);
	}
}

// class VitalTiles extends Component {
// 	constructor(props) {
// 		super();
// 		this.state = {
// 			name: "",
// 			value: "Loading...",
// 			units: "",
// 		};
// 	}

// 	componentDidMount() {
// 		//var i = {this.props.i};
// 		var parentComponent = this;
// 		$.when(this.props.observations).done(function(obs) {
// 			var testobject = {};
// 			testobject[parentComponent.props.code] = [];
// 			var result = searchByCode(obs, testobject);
// 			var precision = 0;
// 			if (result[parentComponent.props.code][0]['value'] < 1) {
// 				precision = 2;
// 			}
// 			if (result[parentComponent.props.code][0]['text'] === "High Density Lipoprotein Cholesterol") {
// 				result[parentComponent.props.code][0]['text'] = "HDL Cholesterol";
// 			}
// 			if (result[parentComponent.props.code][0]['text'] === "Low Density Lipoprotein Cholesterol") {
// 				result[parentComponent.props.code][0]['text'] = "LDL Cholesterol";
// 			}
// 			if (result[parentComponent.props.code][0]['text'] === "Systolic Blood Pressure") {
// 				result[parentComponent.props.code][0]['text'] = "Systolic BP";
// 			}
// 			if (result[parentComponent.props.code][0]['text'] === "Diastolic Blood Pressure") {
// 				result[parentComponent.props.code][0]['text'] = "Diastolic BP";
// 			}
// 			var forSparkline = [];
// 			for(var i = 0; i < result[parentComponent.props.code].length; i++) {
// 				forSparkline.push({
// 					name: result[parentComponent.props.code][i]['date'].toString(),
// 					value: (result[parentComponent.props.code][i]['value'])
// 				})
// 			}
// 			parentComponent.setState({
// 				measurementName: result[parentComponent.props.code][0]['text'],
// 				value: result[parentComponent.props.code][0]['value'].toFixed(precision) + " " + result[parentComponent.props.code][0]['unit'],
// 				data: forSparkline
// 			});
// 		});
// 	}
// 	render() {
// 		var link = window.location.href + 'measure/' + this.props.code;
// 		return (
// 			<div>
// 				<div style={{width: "100%", height:"85px", borderRadius: "10px", backgroundColor: "#AECEDA", opacity: "0.9"}}> {this.props.children} </div><br/>
// 			</div>
// 		)
// 	}
// }

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
			parentComponent.setState({
				measurementName: result[parentComponent.props.code][0]['text'],
				value: result[parentComponent.props.code][0]['value'].toFixed(precision) + " " + result[parentComponent.props.code][0]['unit'],
				data: forSparkline
			});
		});
	}
	render() {
		var link = window.location.href + 'measure/' + this.props.code;
		return (
			<div>
				<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 750 180" version="1.1">
	    			<defs>
	        			<ellipse id="path-1" cx="49.6001408" cy="49.8750284" rx="49.6001408" ry="49.8750284"></ellipse>
	    			</defs>
					    <g id="Patient-Page" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
					        <g id="Desktop-HD" transform="translate(-18.000000, -253.000000)">
					            <g id="Group-4" transform="translate(18.000000, 253.000000)">
					            	<a xlinkHref={link} target="_blank">
					               		<rect id="Rectangle-5" fillOpacity="0.9" fill="#AECEDA" x="0" y="0" width="750" height="180" rx="10" ></rect>
					               		{this.props.children}
				                	</a>
					                <text id="Weight" fontFamily="Helvetica" fontSize="56" fontWeight="normal" fill="#000000">
					                    <tspan x="180" y="56">{this.state.measurementName}</tspan>
					                </text>
					                <text id="150-lbs" fontFamily="HiraKakuPro-W3, Hiragino Kaku Gothic Pro" fontSize="45" fontWeight="300" fill="#000000">
					                    <tspan x="208" y="130">{this.state.value}</tspan>
					                    <tspan x="286.84" y="130" fontSize="32"> </tspan>
					                    <tspan x="297.496" y="130" fontSize="20">{this.state.units}</tspan>
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