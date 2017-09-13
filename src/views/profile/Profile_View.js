import React, { Component } from 'react';

import DemographicTile from './DemographicTile';
import VitalTile from './VitalTile';
import MedicationTile from './MedicationTile';
import EnvironmentTile from './EnvironmentFactors.js';
import AppointmentsTile from './AppointmentsTile';

import Scale from '../../components/logos/scale';
import BP from '../../components/logos/bp';
import Cholesterol from '../../components/logos/chol';
import Glucose from '../../components/logos/glucose';
//import {getTopObservations, getTopObservationsDemo, SparklinesReferenceLine} from '../../services/patient_view_utils.js'
//import { LineChart, Line, Tooltip } from 'recharts';

//import {Diabetes, COPD, KFScore, CHADScore, ReynoldsScore, RiskTile, HelpRiskTile} from '../RiskCalculators/Risk_Components.js';
import {reynoldsScore} from '../../services/RiskCalculators/reynolds.js'
import {CHADScore} from '../../services/RiskCalculators/CHAD.js'
import {KFScore} from '../../services/RiskCalculators/get_KFRisk.js'
import {COPDScore} from '../../services/RiskCalculators/COPD.js'
import {diabetesScore} from '../../services/RiskCalculators/get_diabetes.js'
import RiskTile from '../../services/RiskTiles/RiskTile.js'
import HelpRiskTile from '../../services/RiskTiles/HelpRiskTile.js'
import {getPtLoc} from '../../services/Environment/environmental_utils.js'

import { medListStyle, medListDivStyle } from './Profile_View-style.js'

class ProfileView extends Component {
	constructor(props){
		super(props);
	}

	render(){ //Known issue; the code can easily be changed, the icon not so much....
		//var ptLoc = getPtLoc(this.props.patient);
		var ptLoc = {"country_code":"US","region_code":"MA","city":"Pepperell","zip_code":"01463","latitude":42.669838,"longitude":-71.5961267};
		return (
			<div>
				<div className="row">
					<div className = "col-sm-6">
						<div className="row">
							<div className="col-sm-6">
								<VitalTile measurementName="Systolic BP" units="mmHg" past="120" present="110" pastDate="2016-01-01-00:00" presentDate="2017-01-01-00:00"/>
							</div>
							<div className="col-sm-6">
								<VitalTile measurementName="Systolic BP" units="mmHg" past="120" present="130" pastDate="2016-01-01-00:00" presentDate="2017-01-01-00:00"/>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-6">
								<VitalTile measurementName="Systolic BP" units="mmHg" past="120" present="130" pastDate="2016-01-01-00:00" presentDate="2017-01-01-00:00"/>
							</div>
							<div className="col-sm-6">
								<VitalTile measurementName="Systolic BP" units="mmHg" past="120" present="130" pastDate="2016-01-01-00:00" presentDate="2017-01-01-00:00"/>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-6">
								<VitalTile measurementName="Systolic BP" units="mmHg" past="120" present="130" pastDate="2016-01-01-00:00" presentDate="2017-01-01-00:00"/>
							</div>
							<div className="col-sm-6">
								<VitalTile measurementName="Systolic BP" units="mmHg" past="120" present="130" pastDate="2016-01-01-00:00" presentDate="2017-01-01-00:00"/>
							</div> 
						</div>
					</div>
					<div className = "col-sm-6">
						<EnvironmentTile ptLoc={ptLoc}/> {/* Env tile takes in a ptLoc object -- promises now only come from APIs */}
					</div>
				</div>
				<div className="row">
					<div className = "col-sm-2">
        				<RiskTile scoreName="General Cardiac" score={10} sym="%" context="within 10 years" url="General_Cardiac"/>
					</div>
					<div className = "col-sm-2">
						<RiskTile scoreName="Stroke" score={10} sym="%" context="within 1 year" url="Stroke"/>
					</div>
					<div className = "col-sm-2">
	        			<RiskTile scoreName="Kidney Failure" score={10} sym="%" context="within 5 years" url="Kidney_Failure"/>
					</div>
					<div className = "col-sm-2">
	        			<RiskTile scoreName="COPD Mortality" score={10} sym="%" context="within 4 years" url="COPD_Mortality"/>
					</div>
					<div className = "col-sm-2">
	        			<RiskTile scoreName="Diabetes" score={10} sym="%" context="within 5 years" url="Diabetes"/>
					</div>
				</div>
				{/*<div className="row">
					<div className = "col-sm-2">
        				<RiskTile scoreName="General Cardiac" score={reynoldsScore(pt, obs)} sym="%" context="within 10 years" url="General_Cardiac"/>
					</div>
					<div className = "col-sm-2">
						<RiskTile scoreName="Stroke" score={CHADScore(pt, conds)} sym="%" context="within 1 year" url="Stroke"/>
					</div>
					<div className = "col-sm-2">
	        			<RiskTile scoreName="Kidney Failure" score={KFRScore(pt, obs)} sym="%" context="within 5 years" url="Kidney_Failure"/>
					</div>
					<div className = "col-sm-2">
	        			<RiskTile scoreName="COPD Mortality" score={COPDScore(pt, obs, conds)} sym="%" context="within 4 years" url="COPD_Mortality"/>
					</div>
					<div className = "col-sm-2">
	        			<RiskTile scoreName="Diabetes" score={diabetesScore(pt, obs, conds, medreq)} sym="%" context="within 5 years" url="Diabetes"/>
					</div>
			
					<div className = "col-sm-2">
						<div><HelpRiskTile scoreName="Help"/></div>
					</div>
				</div>*/}
			</div>

		)
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
// 				Name: result[parentComponent.props.code][0]['text'],
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


export default ProfileView;