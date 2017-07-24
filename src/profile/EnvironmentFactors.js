import React, { Component } from 'react';
import $ from 'jquery'; 

import PollenLevel from './env/PollenLevel.js'
import AirQuality from './env/AirQuality.js';

const _aqiFeed = window._aqiFeed;

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
		}
	*/

	componentWillMount() {
		console.log("envi comp mounted");



		var ptHasAddress = false;

		var ptPromise = this.props.patient.then(function(pt){
			console.log("patient:", pt);
			if(!pt[0].address){
				$.getJSON('http://freegeoip.net/json/?callback=?', function(data) {
					  this.setState({ptLoc:data});
					}.bind(this));
				//this.setState({pt:})
			} 
			else {
				var fullAddress = pt[0].address[0];
				this.setState({ptLoc:{
						"country_code":fullAddress.country,
						"region_code":fullAddress.state,
						"city":fullAddress.city,
						"zip_code":fullAddress.postalCode
					}
				});

			}
		}.bind(this))
		

	}

	render(){
		const headingStyle = {

			fontFamily:"Helvetica",
			fontSize:"32",
			fontWeight:"normal",
			fill:"#000000",
			textAlign:"center"

		}

		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12 text-center">
						<text style={headingStyle}>Environmental Effects</text>
					</div>
				</div>
				<div className="row">
					<div className="col-md-4">
						<PollenLevel location={this.state.ptLoc} />
					</div>
					<div className="col-md-4">
						<AirQuality location={this.state.ptLoc} />
					</div>
					<div className="col-md-4">
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
					</div>
					<div className="col-md-6">
					</div>
					<div className="col-md-6">
					</div>
				</div>
			</div>
		);
	}
}

export default EnvironmentTile;