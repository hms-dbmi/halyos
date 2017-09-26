import 'purecss/build/pure.css';
import React, { Component } from 'react';

import DemographicTile from './DemographicTile';
import VitalTile from './VitalTile';
import {FilteredList, List} from './FilteredList.js';
import MedicationTile from './MedicationTile';
import EnvironmentTile from './EnvironmentFactors.js';
import AppointmentsTile from './AppointmentsTile';

import PollenLevel from './env/PollenLevel.js'
import AirQuality from './env/AirQuality.js';
import Flu from './env/Flu.js';
import {envTileStyle} from './Environment-style.js';

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

//import AboutRisk from '../risk/AboutRisk.js';

class ProfileView extends Component {
	constructor(props){
		super(props);
	}

	render(){ //Known issue; the code can easily be changed, the icon not so much....
		//var ptLoc = getPtLoc(this.props.patient);
		var ptLoc = {"country_code":"US","region_code":"MA","city":"Pepperell","zip_code":"01463","latitude":42.669838,"longitude":-71.5961267};
		var patient = {"gender": "Male", "birthDate":'1979-02-03-12:45'};
		var measurements = [{"name": "Systolic Blood Pressure", "units": "mmHg", "past": "120", "present": "110" },
		{"name": "Diastolic Blood Pressure", "units": "mmHg", "past": "90", "present": "95" },
		{"name": "Heart Rate", "units": "bpm", "past": "90", "present": "70" },
		{"name": "Respiration Rate", "units": "breaths/min", "past": "18", "present": "18" }]
		var mappedMeasures = measurements.map((measurements) => 
			<tr className = "pure-table pure-table-horizontal">
				<td> {measurements["name"]} [{measurements["units"]}] </td>
				<td> {measurements["past"]}</td>
				<td> {measurements["present"]}</td>
				<td> :) </td>
			</tr>
		);
		return (
			<div>
				<div className="pure-g">
					<div className="pure-u-1-5"><RiskTile scoreName="General Cardiac" score={10} sym="%" context="within 10 years" url="General_Cardiac"/> </div>
					<div className="pure-u-1-5"><RiskTile scoreName="Stroke" score={10} sym="%" context="within 1 year" url="Stroke"/></div>
					<div className="pure-u-1-5"><RiskTile scoreName="Kidney Failure" score={10} sym="%" context="within 5 years" url="Kidney_Failure"/></div>
					<div className="pure-u-1-5"><RiskTile scoreName="COPD Mortality" score={10} sym="%" context="within 4 years" url="COPD_Mortality"/></div>
					<div className="pure-u-1-5"><RiskTile scoreName="Diabetes" score={10} sym="%" context="within 5 years" url="Diabetes"/></div>
				</div>
				<br/><br/>
				<div className="pure-g">
					<div className="pure-u-6-24" style={{"padding-left":"2px"}}>
						    Measurements: <input type="text" name="measureName"/>
				    </div>
				    <div className="pure-u-2-24">
						    Past
				    </div>
				    <div className="pure-u-2-24">
						    Now
				    </div>
				    <div className="pure-u-2-24">
						    Future
				    </div>
				    <div className="pure-u-8-24" style={{"text-align":"center", "font-size":"20"}}>
				    	<text>Suggested Preventative Care</text>
				    </div>
				    <div className="pure-u-4-24" style={{"text-align":"center", "font-size":"20"}}>
				    	<text>Environment</text>
				    </div>
				</div>
				<div>
					<div className="pure-u-1-2" style={{"padding-left":"2px", "padding-right":"2px", "height":"300px", "overflow":"auto"}}>
			        	{measurements.map((measurement) =>
			        		<VitalTile measurementName={measurement["name"]}
			        		units={measurement["units"]}
			        		past={measurement["past"]}
			        		present={measurement["present"]}
			        		/>
		        		)}
					</div>
					<div className="pure-u-8-24">
						<AppointmentsTile patient={patient}/>
					</div>
					<div className="pure-u-4-24">
						<div style={{"padding-left":"60px"}}>
							<div style={envTileStyle}>
								<PollenLevel location={ptLoc} />
							</div>
							<div style={envTileStyle}>
								<AirQuality location={ptLoc} />
							</div>
							<div style={envTileStyle}>
								<Flu location={ptLoc} />
							</div>
						</div>
					</div>
					<FilteredList measurements={measurements}/>
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

export default ProfileView;