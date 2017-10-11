import React, { Component } from 'react';
export default class LastVisit extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const mostRecentEncounter = this.props.encounters[0];
		const mostRecentDate = mostRecentEncounter.effectiveDateTime;
		return (
			<div>
				Last Visit: {mostRecentDate} icon
			</div>
		);
	}

}