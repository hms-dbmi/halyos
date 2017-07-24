import React, { Component } from 'react';
import $ from 'jquery'; 
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Pollen from '../../logos/pollen.js';
//const PollenSVG = require('../../logos/pollen.svg');

class PollenLevel extends Component {
	constructor(props) {
		super(props);
		this.state = {data: null};

	}

	componentWillReceiveProps(nextProps) {
		if ((this.state.data === null) && nextProps.location && !this.props.location){
			$.getJSON('http://dataservice.accuweather.com/forecasts/v1/daily/1day/' + nextProps.location.zip_code + '?apikey=Dkvl9QArEY7A7Kzofew70OEHTNDYBjEA&details=true', function(data) {
					  this.setState({data:data});
					}.bind(this));
	
		}
		
	}

	render() {
		if (!this.props.location || !this.state.data){
			return (
				<div>Loading...</div>
			)
		}

		var allergyMeasures = this.state.data.DailyForecasts[0].AirAndPollen.filter(function(item){
			return (item.Name !== "UVIndex" && item.Name !== "AirQuality");

		})
		const listItems = allergyMeasures.map((item) => 
			<tr>
				<td>{item.Name}</td>
				<td>{item.Category}</td>
			</tr>
		);

		const tableStyle = {

			align: "center",
			textAlign:"left"
		}


		const tooltip = (
		  <Tooltip id="tooltip">
			<h5>Pollen Levels</h5>
			<table style={tableStyle}>
				<thead>
					<tr>
					    <th>Type</th>
					    <th>Level</th> 
					 </tr>
				 </thead>
				 <tbody>
				 {listItems}
				</tbody>
			</table>
		  </Tooltip>
		);


		return (	
			<Pollen placement="top" tooltip={tooltip}/>
		);
		
	}
}

export default PollenLevel;