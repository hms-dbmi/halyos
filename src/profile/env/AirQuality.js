import React, { Component } from 'react';
import $ from 'jquery'; 
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import AIQ from '../../logos/aiq.js';
//const PollenSVG = require('../../logos/pollen.svg');

class AirQuality extends Component {
	constructor(props) {
		super(props);
		this.state = {data: null};

	}

	componentDidMount() {
			$.getJSON('http://api.airvisual.com/v2/nearest_city?key=RaaZECPFvpEBgetio', function(data) {
					  this.setState({data:data});
					}.bind(this));
	
		}

	render() {
		if (!this.state.data){
			return (
				<div>Loading...</div>
			)
		}


		const tableStyle = {

			align: "center",
			textAlign:"left"
		}

		const aqiLevels = [
			[50,"Good", "#00FF00","Air quality is considered satisfactory, and air pollution poses little or no risk."],
			[100,"Moderate","#FFFF00","Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."],
			[150,"Unhealthy for Sensitive Groups","#FFA500","Members of sensitive groups may experience health effects. The general public is not likely to be affected."],
			[200,"Unhealthy","#FF0000","Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."],
			[300,"Very unhealthy","#800080","Health alert: everyone may experience more serious health effects."],
			[500,"Hazardous","#800000","Health warnings of emergency conditions. The entire population is more likely to be affected."],
		]

		var currentAqiQualityLevel;

		for (let val of aqiLevels){
			if (this.state.data.data.current.pollution.aqius < parseInt(val[0])){
				currentAqiQualityLevel = val;
				break;
			}
		}

		const tooltip = (
		  <Tooltip id="tooltip">
			<h5>Air Quality (AQI) Near You</h5>
			<table style={tableStyle}>
				 <tbody>
				 	<tr>
					    <td><strong>Main Pollutant</strong></td>
					    <td>{this.state.data.data.current.pollution.mainus}</td> 
					</tr>
					<tr>
					    <td><strong>Air Quality Level</strong></td>
					    <td>{currentAqiQualityLevel[1]}</td> 
					</tr>
				</tbody>
			</table>
			<h6>{ currentAqiQualityLevel[3] }</h6>
		  </Tooltip>
		);


		return (	
			<AIQ placement="top" tooltip={tooltip}/>
		);
		
	}
}

export default AirQuality;