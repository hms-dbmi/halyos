import React, { Component } from 'react';
import $ from 'jquery'; 

import PollenLevel from './env/PollenLevel.js'
import AirQuality from './env/AirQuality.js';
import Flu from './env/Flu.js';

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

	componentWillReceiveProps(nextProps) {
		var ptHasAddress = false;
		if(nextProps.patient) {
			if(!nextProps.patient[0].address) {
				$.getJSON('http://freegeoip.net/json/?callback=?', function(data) {
					  this.setState({ptLoc:data});
					}.bind(this));
			}
			else {
				var fullAddress = nextProps.patient[0].address[0];
				$.getJSON('https://api.opencagedata.com/geocode/v1/json?q='+ fullAddress.postalCode + '&countrycode='+ fullAddress.country+'&no_annotations=1&key=bc76774a452346449916c91155a0b96b', function(data) {
					  //console.log("what da hell", data.results[0])
					  this.setState({ptLoc: {
						"country_code":fullAddress.country,
						"region_code":fullAddress.state,
						"city":fullAddress.city,
						"zip_code":fullAddress.postalCode,
						"latitude":data.results[0].geometry.lat,
						"longitude":data.results[0].geometry.lng
						}
				});

					}.bind(this));
			}
		}
	}

	// componentWillMount() {
	// 	//console.log("envi comp mounted");




	// 	var ptPromise = this.props.patient.then(function(pt){
	// 		//console.log("patient:", pt);
	// 		if(!pt[0].address){
	// 			$.getJSON('http://freegeoip.net/json/?callback=?', function(data) {
	// 				  this.setState({ptLoc:data});
	// 				}.bind(this));
	// 			//this.setState({pt:})
	// 		} 
	// 		else {
	// 			var fullAddress = pt[0].address[0];
	// 			$.getJSON('https://api.opencagedata.com/geocode/v1/json?q='+ fullAddress.postalCode + '&countrycode='+ fullAddress.country+'&no_annotations=1&key=bc76774a452346449916c91155a0b96b', function(data) {
	// 				  //console.log("what da hell", data.results[0])
	// 				  this.setState({ptLoc: {
	// 					"country_code":fullAddress.country,
	// 					"region_code":fullAddress.state,
	// 					"city":fullAddress.city,
	// 					"zip_code":fullAddress.postalCode,
	// 					"latitude":data.results[0].geometry.lat,
	// 					"longitude":data.results[0].geometry.lng
	// 					}
	// 			});
					

	// 				}.bind(this));
	// 		}
	// 	}.bind(this))
		

	// }

	render(){
		const headingStyle = {

			fontFamily:"Helvetica",
			fontSize:"20",
			fontWeight:"normal",
			fill:"#000000",
			textAlign:"center"

		}

		const tileStyle = {
			border: "1px"
		}
		console.log("PATIENT LOCATION", this.state.ptLoc);
		return (
			<div style={ tileStyle } className="panel panel-default container-fluid">
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
						<Flu location={this.state.ptLoc} />
					</div>
					<br/>
					{this.state.ptLoc && <text><br/>Data is gathered for {this.state.ptLoc.city}, {this.state.ptLoc.region_code}.</text>}
				</div>

			</div>
		);
	}
}

export default EnvironmentTile;