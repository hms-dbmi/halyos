import React, { Component } from 'react';
import Calendar from './logos/calendar.js';
export default class LastVisit extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if(this.props.encounters) {
			const mostRecentEncounter = this.props.encounters[0];
			const mostRecentDate = mostRecentEncounter.effectiveDateTime;
			return (
				<div style={{"display":"flex", "flex-direction":"row", "align-items":"center", "padding-top":"10px"}}>
					Last Visit: {mostRecentDate} &nbsp;&nbsp; <Calendar/>
				</div>
			);
		}
		return (
			<div> Loading error... </div>
		);
	}

}