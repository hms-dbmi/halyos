import React, { Component } from 'react';
import Scale from '../logos/scale';
import BP from '../logos/bp';
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
		console.log("here",this.props);
		return (
			<div>
				<VitalTile measurementName="Weight" value="150" units="lbs"><Scale/></VitalTile>
				<VitalTile measurementName="Systolic BP" value="115" units="mmHg"><BP/></VitalTile>
				<VitalTile measurementName="Diastolic BP" value="70" units="mmHg"><Scale/></VitalTile>
			</div>
		)
	}

}

class VitalTile extends Component {
	constructor(props) {
		super();
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
				                    <tspan x="110" y="38">{this.props.measurementName}</tspan>
				                </text>
				                <text id="150-lbs" fontFamily="HiraKakuPro-W3, Hiragino Kaku Gothic Pro" fontSize="40" fontWeight="300" fill="#000000">
				                    <tspan x="208" y="83">{this.props.value}</tspan>
				                    <tspan x="286.84" y="83" fontSize="32"> </tspan>
				                    <tspan x="297.496" y="83" fontSize="20">{this.props.units}</tspan>
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