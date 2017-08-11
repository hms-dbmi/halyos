import {calcCHADScore} from '../RiskCalculators/CHAD.js';
import React, { Component } from 'react';
import $ from 'jquery'; 
import {calculateAge, pullCondition} from '../utils/general_utils.js';

class CHADScoreN extends Component {
	constructor(props) {
		super();
		this.state = {
			score: "..."
		};
	}

	componentDidMount() {
		var parentComponent = this;
		$.when(this.props.pt, this.props.conds).done(function(pt, conds) {
		    var chf = pullCondition(conds, ["42343007"]); //byCodes only works w LOINC
		    var hypertension = pullCondition(conds, ["38341003"]);
		    var vascDisease = pullCondition(conds, ["27550009"]);
		    var diabetes = pullCondition(conds, ["73211009"]);
		    var strTIAthrom = pullCondition(conds, ["230690007", "266257000", "13713005"]);
			var CHADscore = calcCHADScore(calculateAge(pt[0].birthDate), //age
			pt[0].gender, //gender
			chf, //chf
			hypertension, //hypertension
			vascDisease, //vascDisease
			diabetes, //diabetes
			strTIAthrom); //strTIAthrom
			parentComponent.setState({
				score: CHADscore,
				sym: "%",
				context: "within one year"
			});
		});
	}

	render() {
		var opacity = this.state.score/100*5; //value is multiplied by 5 cuz max risk is 13%
		var link = window.location.origin + '/risk/Stroke';
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

export default CHADScoreN;