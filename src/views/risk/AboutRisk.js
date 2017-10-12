import React, { Component } from 'react';
import riskText from '../../../texts/risk-text.js';
class AboutRisk extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log("risk name", this.props.riskName);
		console.log(riskText);
		console.log(riskText['riskText'][this.props.riskName]);
		return (
			<div>
			About {this.props.riskName}
			<hr/>
			{riskText['riskText'][this.props.riskName]['info']}
			</div>
		);
	}

}
export default AboutRisk;