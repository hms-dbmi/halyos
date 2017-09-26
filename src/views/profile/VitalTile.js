import React, { Component } from 'react';
import $ from 'jquery'; 
import { searchByCode } from '../../services/risk_score_utils.js';
import {getNearest} from '../../services/general_utils.js';

class VitalTile extends Component {
	constructor(props) {
		super(props);
		console.log("props", this.props);
		this.state = {
			measurementName: this.props.measurementName
		}
	}

	componentDidMount() {
		if (this.props.measurementName === "High Density Lipoprotein Cholesterol") {
				this.state.measurementName = "HDL Cholesterol";
			}
		if (this.props.measurementName === "Low Density Lipoprotein Cholesterol") {
			this.state.measurementName = "LDL Cholesterol";
		}
		if (this.props.measurementName === "Systolic Blood Pressure") {
			this.state.measurementName = "Systolic BP";
		}
		if (this.props.measurementName === "Diastolic Blood Pressure") {
			this.state.measurementName = "Diastolic BP";
		}
	}

	render() {
		console.log(this.state.measurementName, 
			this.props.units, 
			this.props.past, 
			this.props.pastDate, 
			this.props.present, 
			this.props.presentDate, 
			this.props.future) //should be changed to state if we lump the future slider in here, which we shouldn't
		var arrow = "No change"
		if(this.props.past < this.props.present) {
			arrow = "Up";
		}
		else if(this.props.past > this.props.present) {
			arrow = "Down";
		}
		return (
			<div>
				<div className="pure-u-12-24">
					{this.state.measurementName} &nbsp; [{this.props.units}]
				</div>
				<div className="pure-u-2-24">
					{this.props.past}
				</div>
				<div className="pure-u-2-24">
					{arrow} 
				</div>
				<div className="pure-u-4-24">
					{this.props.present}
				</div>
				<div className="pure-u-4-24">
					{this.props.future}
				</div>
				<hr/>
			</div>
		)
	}
}

export default VitalTile;