import React, { Component } from 'react';
import $ from 'jquery'; 
import { searchByCode } from '../../services/risk_score_utils.js';
import {getNearest} from '../../services/general_utils.js';
import ArrowDown from '../../components/logos/arrows/ArrowDown.js';

class VitalTile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			measurementName: this.props.measurementName
		}
	}

	componentDidMount() {

	}

	render() {
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
					{this.props.measurementName} &nbsp; [{this.props.units}]
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