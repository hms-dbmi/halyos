import React, { Component } from 'react';
import $ from 'jquery'; 
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Syringe from './logos/syringe/syringe.js';
//const PollenSVG = require('../../logos/pollen.svg');
import { coordDistance } from '../../../services/general_utils.js';

class Flu extends Component {
	constructor(props) {
		super(props);
		this.state = {data: null};

	}

	componentDidMount() {
			$.getJSON('https://api.v2.flunearyou.org/map/markers', function(data) {
					  this.setState({data:data});
					}.bind(this));
	
		}

	render() {
		if (!this.state.data || !this.props.location){
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
			
			//the following check is because of a weird bug where (supposedly) randomly it throws a null found error.
			if (destination.latitude && destination.longitude){
				var dist = coordDistance(parseInt(this.props.location.latitude), parseInt(this.props.location.longitude), parseInt(destination.latitude), parseInt(destination.longitude));	
			}
			else {
				continue;
			}

			//This corresponds to 5 miles (I'm pretty sure)
			if (leastDistanceAway < 0.07){
				break;
			}
			if (leastDistanceAway > dist){

				closestPoint = destination;
				leastDistanceAway = dist;
			}
		}

		//currently arbitary rankings
		const fluLevels = [
			[3,"Low", "#006ba4","There are a few cases of flu in your area. You might not need the seasonal vaccine, but if it is flu season, check with your healthcare provider."],
			[5,"Moderate","#FFFF00","There are a considerable number of cases of the flu in your area, gettting the seasonal vaccine is recommended."],
			[10,"High","","There are many cases of flu in your area, get your seasonal flu vaccine ASAP!"],
		]
		
		var currentFluLevel;

		for (let val of fluLevels){
			if (closestPoint.flu < parseInt(val[0])){
				currentFluLevel = val;
				break;
			}
		}


		const tooltip = (
		  <Tooltip id="tooltip">
			<h6><strong>Mentions of Flu Symptoms Near You</strong></h6>
			<h4><strong>{closestPoint.flu}</strong></h4>
			<h6>{currentFluLevel[3]}</h6>
		  </Tooltip>
		);


		return (	
			<Syringe placement="top" tooltip={tooltip}/>
		);
		
	}
}

export default Flu;