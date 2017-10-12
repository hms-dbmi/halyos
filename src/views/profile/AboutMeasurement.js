import 'purecss/build/pure.css';
import React, { Component } from 'react';
import text from '../../texts/measurement-text.js';
import { measurementTitleStyle, measurementDetailTextStyle, affectedRiskScoreTitleStyle, measurementDetailsHeaderStyle, measurementDetailsSubheadingStyle } from '../../styles/measurement-view-style.js'


export class AboutMeasurement extends Component {
	constructor(props) {
		super();
		this.state = {
			name: "Loading...",
			meaning: "Loading...",
			important: "Loading...",
			improve: "Loading..."
		};
	}

	componentDidMount() {
		//console.log(this.props.measurementCode);
		//console.log("Measurementment Text", text['text']);
		if(text['text'][this.props.measurementCode]) {
			this.setState({
			name: text['text'][this.props.measurementCode].text,
			meaning: text['text'][this.props.measurementCode].meaning,
			important: text['text'][this.props.measurementCode].important,
			improve: text['text'][this.props.measurementCode].improve
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		//console.log("HIYA!", this.props);
		if(text['text'][nextProps.measurementCode]) {
			this.setState({
			name: text['text'][this.props.measurementCode].text,
			meaning: text['text'][nextProps.measurementCode].meaning,
			important: text['text'][nextProps.measurementCode].important,
			improve: text['text'][nextProps.measurementCode].improve
			});
		}
		else {
			this.setState({
				name: "I'm not sure who I am?",
				meaning: "No data available. Please consult your doctor.",
				important: "No data available. Please consult your doctor.",
				improve: "No data available. Please consult your doctor."
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
				<text style={measurementDetailsSubheadingStyle}>
					<b>What</b> does my {this.state.name} mean? <br/>
				</text>
				<div style={{'border-bottom':'1px #DCDCDC solid'}}>
					<text style={measurementDetailTextStyle}>
						{this.state.meaning} <br/> Source: WebMD <br/>
					</text>
				</div>
				<text style={measurementDetailsSubheadingStyle}>
					<b>Why</b> is my {this.state.name} important? <br/>
				</text>
				<div style={{'border-bottom':'1px #DCDCDC solid'}}>
					<text style={measurementDetailTextStyle}>
						{this.state.important} <br/> Source: WebMD <br/>
					</text>
				</div>
				<text style={measurementDetailsSubheadingStyle}>
					<b>How</b> can I make it better? <br/> 
				</text>
				<div style={{'border-bottom':'1px #DCDCDC solid'}}>
					<text style={measurementDetailTextStyle}>
						{this.state.improve} <br/> Source: WebMD <br/>
					</text>
				</div>
			</div>
		);
	}

}