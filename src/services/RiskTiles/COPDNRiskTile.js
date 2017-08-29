import {calcCOPD} from '../RiskCalculators/COPD.js';
import React, { Component } from 'react';
import $ from 'jquery'; 
import {searchByCode, calculateAge, pullCondition} from '../../services/risk_score_utils.js';

class COPDN extends Component {
	constructor(props) {
		super();
		this.state = {
			score: "..."
		};
	}

	componentDidMount() {
		var parentComponent = this;
		$.when(this.props.pt, this.props.obs, this.props.conds).done(function(pt, obs, conds) {
			//calcCOPD(age, confusion, bun, rr, sbp, dbp)
			var confusion = pullCondition(conds, ["40917007"]); //could be reprogrammed for O(n) instead of O(n*m) if time
			var measurementObject = {
				'8480-6': [], //sysBP
				'8462-4': [], //diasBP
				'6299-2': [], //bun
				'9279-1': [] //rr
			};
			var sortedObs = searchByCode(obs, measurementObject);
			for (var key in sortedObs) {
				if(sortedObs.hasOwnProperty(key)) {
					if(sortedObs[key].length == 0) {
						alert("Patient does not have adequate measurements for COPD Risk Score.");
						////console.log(sortedObs);
						return;
					}
				}
			}
			var COPDScore = calcCOPD(calculateAge(pt[0].birthDate),
				confusion,
				sortedObs['6299-2'][0].value,
				sortedObs['9279-1'][0].value,
				sortedObs['8480-6'][0].value,
				sortedObs['8462-4'][0].value);
			parentComponent.setState({
				score: COPDScore,
				sym: "%",
				context: "within 4 years"
			});
		});
	}

	render() {
		var opacity = this.state.score/100*5; //value is multiplied by 5 cuz max risk is 11%
		var link = window.location.origin + '/risk/COPD_Mortality';
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

export default COPDN;
