import {calcDiabetesRisk} from '../RiskCalculators/get_diabetes.js';
import React, { Component } from 'react';
import $ from 'jquery'; 
import {calculateAge, pullCondition} from '../utils/general_utils.js';
import SkyLight from 'react-skylight';

class DiabetesN extends Component {
	constructor(props) {
		super();
		this.state = {
			score: "..."
		};
	}

	componentDidMount() {
		var parentComponent = this;
		$.when(this.props.pt, this.props.obs, this.props.conds, this.props.medreq).done(function(pt, obs, conds, meds) {
			//calcDiabetesRisk(age, gender, bmi, hyperglycemia, historyOfAntihypDrugs, waist)
			var waist = pullCondition(obs, ['56115-9', '56114-2', '56117-5', '8280-0', '8281-8'])
			var bmi = pullCondition(obs, ['39156-5']);
			var hyperglycemia = pullCondition(conds, ['80394007']);
			if (waist.length == 0 || bmi.length == 0) {
				alert("Patient does not have sufficient measurements for Diabetes Risk Score.");
				////console.log(bmi, waist);
				return;
			}
			var score = calcDiabetesRisk(calculateAge(pt[0].birthDate),
				pt[0].gender,
				bmi[0].valueQuantity.value,
				(hyperglycemia.length != 0),
				false, //NEEDS TO BE FIXED
				waist[0].valueQuantity.value);
			////console.log("diabetes score", score);
			parentComponent.setState({
				score: score,
				sym: "%",
				context: "within 5 years"
			});
		});
	}

	render() {
		var opacity = this.state.score/100;
		var link = window.location.origin.toString() + '/risk/Diabetes';
		return (
			<g>
				<a xlinkHref={link} target="_blank">
		    		<rect width="95%" height="95%" x="2.5%" y="2.5%" rx="20" ry="20" style={{fill:'red',stroke:'#888D95',strokeWidth:3,fillOpacity: opacity}}/>
	    		</a>
				<text x="50%" y="60%" fontSize="28" alignmentBaseline="middle" textAnchor="middle">{this.state.score}{this.state.sym}</text>
			</g>
		);
	}
}

export default DiabetesN;