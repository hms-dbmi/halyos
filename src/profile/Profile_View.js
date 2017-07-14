import React, { Component } from 'react';
import Scale from '../logos/scale';
import BP from '../logos/bp';
import $ from 'jquery'; 
import {getTopObservations} from '../utils/patient_view_utils.js'

class ProfileView extends Component {

	constructor(props){
		super(props);
		//This is how you refer to function clients passed through frmo the App.js

		/*this.search = this.props.client.api.search;
		this.search({type: "Observation", query: {subject: "99912345"}})
      			.then(function(r){
        			console.log("alsjdhfalsdkfjhalsdfjhasldfkjasldfajshd ",JSON.stringify(r,null,2));
	    		});
		*/
	}
	render(){
		return (
			<div>
				<VitalTile i='0' observations={this.props.observations}/>
				<VitalTile i='1' observations={this.props.observations}/>
				<VitalTile i='2' observations={this.props.observations}/>
				<VitalTile i='3' observations={this.props.observations}/>
				<VitalTile i='4' observations={this.props.observations}/>
				<VitalTile i='5' observations={this.props.observations}/>
			</div>
		)
	}

}

class VitalTile extends Component {
	constructor(props) {
		super();
		this.state = {
			name: "",
			value: "Loading...",
			units: "",
		};
	}
	componentDidMount() {
		//var i = {this.props.i};
		var parentComponent = this;
		$.when(this.props.observations).done(function(obs) {
			var topObservations = getTopObservations(obs, 6);
			console.log(topObservations);
			var precision = 3;
			if (topObservations[parentComponent.props.i][0].valueQuantity.value < 1) {
				precision = 2;
			}
			parentComponent.setState({
				measurementName: topObservations[parentComponent.props.i][0].code.coding[0].display,
				units: topObservations[parentComponent.props.i][0].valueQuantity.unit,
				value: topObservations[parentComponent.props.i][0].valueQuantity.value.toPrecision(precision)
			});
		});
	}
	render() {
		return (
			<div>
				<svg width="690px" height="106px" viewBox="0 0 690 106" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
	    			<defs>
	        			<ellipse id="path-1" cx="49.6001408" cy="49.8750284" rx="49.6001408" ry="49.8750284"></ellipse>
	    			</defs>
				    <g id="Patient-Page" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				        <g id="Desktop-HD" transform="translate(-18.000000, -253.000000)">
				            <g id="Group-4" transform="translate(18.000000, 253.000000)">
				                <rect id="Rectangle-5" fillOpacity="0.9" fill="#AECEDA" x="0" y="0" width="690" height="106" rx="7.2"></rect>
				                {this.props.children};
				                <text id="Weight" fontFamily="Helvetica" fontSize="30" fontWeight="normal" fill="#000000">
				                    <tspan x="110" y="38">{this.state.measurementName}</tspan>
				                </text>
				                <text id="150-lbs" fontFamily="HiraKakuPro-W3, Hiragino Kaku Gothic Pro" fontSize="40" fontWeight="300" fill="#000000">
				                    <tspan x="208" y="83">{this.state.value}</tspan>
				                    <tspan x="286.84" y="83" fontSize="32"> </tspan>
				                    <tspan x="297.496" y="83" fontSize="20">{this.state.units}</tspan>
				                </text>
				            </g>
				        </g>
				    </g>
				</svg>
			</div>
		)
	}
}

export default ProfileView;