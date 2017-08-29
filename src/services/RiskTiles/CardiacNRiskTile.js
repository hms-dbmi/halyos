import {calculateReynolds} from '../RiskCalculators/reynolds.js';
import React, { Component } from 'react';
import $ from 'jquery'; 
import {searchByCode, calculateAge} from '../../services/risk_score_utils.js';

class ReynoldsScoreN extends Component {
	constructor(props) {
		super();
		this.state = {
			score: "..."
		};
	}

	componentDidMount() {
		var parentComponent = this;
		$.when(this.props.pt, this.props.obs).done(function(pt, obs) {
			var codesObject = {
				'30522-7': [], //hsCRP
				"2093-3": [], //cholesterol
				"2085-9": [], //HDL
				"8480-6": [] //sysBP
			};
			this.patient = pt[0];
			this.sortedObs = searchByCode(obs, codesObject);
			for (var key in this.sortedObs) {
				if(this.sortedObs.hasOwnProperty(key)) {
					if(this.sortedObs[key].length == 0) {
						//console.log(sortedObs);
						alert("Patient does not have adequate measurements for Reynolds Risk Score.");
						return;
					}
				}
			}
			var reynolds = (calculateReynolds(calculateAge(this.patient.birthDate),
			this.sortedObs['8480-6'][0].value,
			this.sortedObs['30522-7'][0].value,
			this.sortedObs['2093-3'][0].value,
			this.sortedObs['2085-9'][0].value,
			parentComponent.props.smoker, //smoker
			false, //famHist
			this.patient.gender));
			parentComponent.setState({
				score: reynolds,
				sym: "%",
				context: "within 10 years"
			});
		}.bind(this));
	}

	componentWillReceiveProps(nextProps) {

		var reynolds = (calculateReynolds(calculateAge(this.patient.birthDate),
			this.sortedObs['8480-6'][0].value,
			this.sortedObs['30522-7'][0].value,
			this.sortedObs['2093-3'][0].value,
			this.sortedObs['2085-9'][0].value,
			nextProps.smoker, //smoker
			false, //famHist
			this.patient.gender));
		this.setState({
			score: reynolds,
			sym: "%"
		});
		//console.log("next:", nextP
	}

	render() {
		var opacity = this.state.score/100;
		var link = window.location.origin + '/risk/General_Cardiac';
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

export default ReynoldsScoreN;