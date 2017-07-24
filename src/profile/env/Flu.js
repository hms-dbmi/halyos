import React, { Component } from 'react';
import $ from 'jquery'; 
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import AIQ from '../../logos/aiq.js';
//const PollenSVG = require('../../logos/pollen.svg');
import { coordDistance } from '../../utils/general_utils.js';

class Flu extends Component {
	constructor(props) {
		super(props);
		this.state = {data: null};

	}

	componentDidMount() {
			$.getJSON('https://api.v2.flunearyou.org/map/markers', function(data) {
					  console.log("new data flu: ", data);
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

		var leastDistanceAway = Number.POSITIVE_INFINITY; 
		var closestPoint;

		for (let destination of this.state.data){
			console.log(this.props.location.latitude, " ", this.props.location.longitude, " ", destination.latitude, " ", destination.longitude);
			var dist = coordDistance(parseInt(this.props.location.latitude), parseInt(this.props.location.longitude), parseInt(destination.latitude), parseInt(destination.longitude));

			//This corresponds to 5 miles probably...
			if (dist < 0.07){
				break;
			}
			if (leastDistanceAway > dist){

				console.log(destination);
				closestPoint = destination;
				leastDistanceAway = dist;
				console.log("closest point: ", closestPoint, "leastDistanceAway", leastDistanceAway);

			}

		}

		console.log("closest point: ", closestPoint, "leastDistanceAway", leastDistanceAway);
		

		const tooltip = (
		  <Tooltip id="tooltip">
			<h5>Air Quality (AQI) Near You</h5>
			<table style={tableStyle}>
				 <tbody>
				 	<tr>
					</tr>
					<tr>
					</tr>
				</tbody>
			</table>
		  </Tooltip>
		);


		return (	
			<AIQ placement="top" tooltip={tooltip}/>
		);
		
	}
}

export default Flu;