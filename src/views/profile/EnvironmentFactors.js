import React, { Component } from 'react';
import $ from 'jquery'; 

import PollenLevel from './env/PollenLevel.js'
import PollenContainer from './env/PollenContainer'
import AirQuality from './env/AirQuality.js';
import Flu from './env/Flu.js';

import { tileStyle, headingStyle } from './EnvironmentFactors-style.js'

class EnvironmentTile extends Component {
	constructor(props){
		super(props);
		this.state = {ptLoc:null};
	}

	/**
		The patient location array will have at least these things, only use these to ensure that regardless of if we get the info from the IP or from FHIR, we can do something with it
		ptLoc:  {
]		  "country_code": "US",
		  "region_code": "MA",
		  "city": "Boston",
		  "zip_code": "02115",
		  "latitude": 42.3424,
  		  "longitude": -71.0878,
		}
	*/

	componentWillMount() {

	}

	render(){
		console.log("Patient Location",JSON.stringify(this.props.ptLoc))
		return (
			<div style={ tileStyle } className="panel panel-default container-fluid">
				<div className="row">
					<div className="col-md-12 text-center">
						<text style={headingStyle}>Environmental Effects</text>
					</div>
				</div>
				<div className="row">
					<div className="col-md-4">
						<PollenContainer />
					</div>
					<div className="col-md-4">
						<AirQuality location={this.props.ptLoc} />
					</div>
					<div className="col-md-4">
						<Flu location={this.props.ptLoc} />
					</div>
					<br/>
					{this.props.ptLoc && <text><br/>Data is gathered for {this.props.ptLoc.city}, {this.props.ptLoc.region_code}.</text>}
				</div>

			</div>
		);
	}
}

export default EnvironmentTile;