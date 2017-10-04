import 'purecss/build/pure.css';
import React, { Component } from 'react';
import riskText from '../risk/RiskText.js';
import { measurementTitleStyle, measurementDetailTextStyle, affectedRiskScoreTitleStyle, measurementDetailsHeaderStyle, measurementDetailsSubheadingStyle } from '../measurement/Measurement_View-style.js'

export class AboutRisk extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "Loading...",
			text: "Loading..."
		}
	}

	componentDidMount() {
		//console.log(this.props.measurementCode);
		//console.log("Measurementment Text", text['text']);
		if(riskText['riskText'][this.props.risk]) {
			this.setState({
			name: riskText['riskText'][this.props.risk].name,
			text: riskText['riskText'][this.props.risk].text
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		//console.log("HIYA!", this.props);
		if(riskText['riskText'][nextProps.risk]) {
			this.setState({
			name: riskText['riskText'][this.props.risk].name,
			text: riskText['riskText'][nextProps.risk].text
			});
		}
		else {
			this.setState({
				name: "I'm not sure who I am?",
				text: "No data available. Please consult your doctor."
			});
		}
	}

	render() {
		return (
			<div style={{'text-align': 'justify', 'text-justify': 'inter-word'}}>
				<div style={{'border-bottom':'2px #A9A9A9 solid'}}>
					<text x='10' y='50' style={measurementDetailsHeaderStyle}>
						About {this.state.name}: <br/> 
					</text>
				</div>
				<text style={measurementDetailTextStyle}>
					{this.state.text}  <br/>
				</text>
			</div>
		);
	}

}