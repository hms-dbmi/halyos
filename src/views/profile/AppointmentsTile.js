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
		var age = calculateAge(this.props.patient.birthDate);
		age = '40'; //remove later
		var gender = this.props.patient.gender;
		var URL = 'https://healthfinder.gov/api/v2/myhealthfinder.json?api_key=fwafjtozprnxlbbb&age=' + age + "&sex=" + gender;
		$.get(URL).done(function(data) {
			//console.log(data);
			console.log("prev care API", data);
			var interventions = [];
			for(var i = 0; i < data.Result.Resources.All.Resource.length; i++) {
				interventions.push(data.Result.Resources.All.Resource[i].MyHFDescription);
			}
			const listItems = interventions.map((int) =>
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
				<div style={apptListStyle}>
					{this.state.interventionsList}
				</div>
			</div>
		);
	}
}

export default AppointmentsTile;