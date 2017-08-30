import {calcKFRisk} from '../RiskCalculators/get_KFRisk.js';
import React, { Component } from 'react';
import $ from 'jquery'; 
import {calculateAge, pullCondition} from '../../services/risk_score_utils.js';

import { riskTileStyle } from './RiskTile-style.js'

class KFScoreN extends Component {
	constructor(props) {
		super();
		this.state = {
			score: "..."
		};
	}

	componentDidMount() {
		var parentComponent = this;
		$.when(this.props.pt, this.props.obs).done(function(pt, obs) {
			var gfr = pullCondition(obs, ["48643-1", "48642-3", "33914-3"]); //could be reprogrammed for O(n) instead of O(n*m) if time
			var uac = pullCondition(obs, ["14958-3", "14959-1"]);
			if(gfr.length == 0 || uac.length == 0) {
				//console.log("KF score", gfr, uac);
				alert("Patient does not have enough measurements for Kidney Risk Score");
				return;
			}
			else {
				if(gfr[0].component) {
					gfr[0] = gfr[0].component[0];
				}
				var KFRisk = calcKFRisk(pt[0].gender, 
				calculateAge(pt[0].birthDate), 
				gfr[0].valueQuantity.value, //gfr
				uac[0].valueQuantity.value); //uac
				parentComponent.setState({
					score: KFRisk,
					sym: "%",
					context: "within 5 years"
				});
			}
		});
	}

	render() {
		var opacity = this.state.score/100;
		var link = window.location.origin + '/risk/Kidney_Failure';
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

export default KFScoreN;