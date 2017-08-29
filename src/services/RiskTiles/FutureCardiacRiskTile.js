import {calculateReynolds} from '../RiskCalculators/reynolds.js';
import React, { Component } from 'react';
import $ from 'jquery'; 
import {searchByCode, calculateAge} from '../../services/risk_score_utils.js';

class FutureReynoldsScore extends Component {
	constructor(props) {
		super();
		this.state = {
			score: "..."
		};
	}

	componentWillReceiveProps(nextProps){
		var allMeasurements = {};
		for (var key in this.sortedObs) {
			if(this.sortedObs.hasOwnProperty(key)) {
				//console.log("key", key);
				if (nextProps.nextMeasures[key] != undefined){
					allMeasurements[key] = nextProps.nextMeasures[key];
					//console.log("if", nextProps.nextMeasures[key]);
				}
				else {
					//console.log("this isortedpro", this.sortedObs);
					allMeasurements[key] = this.sortedObs[key][0].value
				}
			}
		}

		//console.log("all measurements", allMeasurements);
		//console.log("next:", nextProps);
		var reynolds = calculateReynolds(this.birthDate,
			allMeasurements['8480-6'],
			allMeasurements['30522-7'],
			allMeasurements['2093-3'],
			allMeasurements['2085-9'],
			// sortedObs['8480-6'][0].value,
			// sortedObs['30522-7'][0].value,
			// sortedObs['2093-3'][0].value,
			// sortedObs['2085-9'][0].value,
			nextProps.smoker, //smoker
			this.famHist, //famHist
			this.gender);
			this.setState({
				score: reynolds,
				sym: "%"
			});
		//console.log("next:", nextProps);
	}

	componentDidMount() {
		$.when(this.props.pt, this.props.obs).done(function(pt, obs) {
			var codesObject = {
				'30522-7': [], //hsCRP
				"2093-3": [], //cholesterol
				"2085-9": [], //HDL
				"8480-6": [] //sysBP
			};
			this.sortedObs = searchByCode(obs, codesObject);
			for (var key in this.sortedObs) {
				if(this.sortedObs.hasOwnProperty(key)) {
					if(this.sortedObs[key].length == 0) {
						alert("Patient does not have adequate measurements for Reynolds Risk Score.");
						return;
					}
				}
			}

			this.birthDate = calculateAge(pt[0].birthDate);
			this.smoker = false;
			this.famHist = false;
			this.gender = pt[0].gender;

			var reynolds = calculateReynolds(this.birthDate,
			this.sortedObs['8480-6'][0].value,
			this.sortedObs['30522-7'][0].value,
			this.sortedObs['2093-3'][0].value,
			this.sortedObs['2085-9'][0].value,
			this.smoker, //smoker
			this.famHist, //famHist
			this.gender);
			this.setState({
				score: reynolds,
				sym: "%"
			});
		}.bind(this));
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

export default FutureReynoldsScore;

