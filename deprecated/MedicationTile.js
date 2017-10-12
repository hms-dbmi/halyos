import React, { Component } from 'react';
import $ from 'jquery'; 
import { calculateAge } from '../../services/risk_score_utils';
import { searchByCode } from '../../services/risk_score_utils.js';

import { medListDivStyle, medListStyle } from './MedicationTile-style';

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
				//console.log("Drugs", listItems);
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
				                	<div style={medListDivStyle}><ul style={medListStyle}>{this.state.medListText}</ul></div>
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

export default MedicationTile;