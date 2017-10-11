import React, { Component } from 'react';
import $ from 'jquery'; 
import { calculateAge } from '../../services/risk_score_utils';

import { headerStyle, apptListStyle } from './AppointmentsTile-style';
import PreventativeCareSuggestion from './PreventativeCareSuggestion.js';

class AppointmentsTile extends Component {
	constructor(props) {
		super();
		this.state = {
			interventionsList: ""
		};
	}

	componentDidMount() {
		let age = calculateAge(this.props.patient.birthDate);
		age = '40'; //remove later
		const gender = this.props.patient.gender;
		const URL = 'https://healthfinder.gov/api/v2/myhealthfinder.json?api_key=fwafjtozprnxlbbb&age=' + age + "&sex=" + gender;
		$.get(URL).done(function(data) {
			//console.log(data);
			console.log("prev care API", data);
			let interventions = [];
			for(var i = 0; i < data.Result.Resources.All.Resource.length; i++) {
				interventions.push(data.Result.Resources.All.Resource[i].MyHFDescription);
			}
			let listItems = interventions.map((int) =>
	  			<PreventativeCareSuggestion text={int}/>
			);
			parentComponent.setState({
				interventionsList: listItems
			});
		});
		//console.log(this.props.patient)
		var parentComponent = this;
		$.when(this.props.patient).done(function(pt){

		});
	}

	render() {
		return (
			<div>
				<div style={headerStyle}>
					Suggested Preventative Care for You
				</div>
				<div style={apptListStyle}>
					{this.state.interventionsList}
				</div>
			</div>
		);
	}
}

export default AppointmentsTile;