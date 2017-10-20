import React, { Component } from 'react';
import $ from 'jquery'; 
import { searchByCode } from '../../services/risk_score_utils.js';
import { getPatientName } from '../../services/patient_view_utils.js';

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
			let genderheightstring = pt[0].gender.charAt(0).toUpperCase() + pt[0].gender.slice(1);
			const heightObject = searchByCode(obs, {'8302-2': []})['8302-2'][0];
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

export default DemographicTile;