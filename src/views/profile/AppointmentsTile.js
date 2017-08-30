import React, { Component } from 'react';
import $ from 'jquery'; 
import { calculateAge } from '../../services/risk_score_utils';

class AppointmentsTile extends Component {
	constructor(props) {
		super();
		this.state = {
			interventionsList: ""
		};
	}

	componentDidMount() {
		//console.log(this.props.patient)
		var parentComponent = this;
		$.when(this.props.patient).done(function(pt){
			var age = calculateAge(pt[0].birthDate);
			var gender = pt[0].gender;
			var URL = 'https://healthfinder.gov/api/v2/myhealthfinder.json?api_key=fwafjtozprnxlbbb&age=' + age + "&sex=" + gender;
			$.get(URL).done(function(data) {
				//console.log(data);
				var interventions = [];
				for(var i = 0; i < data.Result.Resources.All.Resource.length; i++) {
					interventions.push(data.Result.Resources.All.Resource[i].MyHFDescription);
				}
				const listItems = interventions.map((int) =>
		  			<li key={int}>{int}</li>
				);
				parentComponent.setState({
					interventionsList: listItems
				});
			});
		});
	}

	render() {
		return (
			<div>
				<p style={{textAlign: 'center', fontSize: "20"}}>
					Suggested Preventative Care for You
				</p>
				<div style={{height:'100px',width:'100%',border:'1px solid #ccc',font:'16px/26px Georgia, Garamond, Serif',overflow:'auto'}}>
					<ul>{this.state.interventionsList}</ul>
				</div>
			</div>
		);
	}
}

export default AppointmentsTile;