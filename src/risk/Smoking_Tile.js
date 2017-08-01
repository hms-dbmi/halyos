import React, { Component } from 'react';
import { getValueQuantities, searchByCode, pullCondition } from '../utils/general_utils.js';
import $ from 'jquery';

const riskObjectConditions = {
		"General_Cardiac": ['266897007'],
        "Stroke": ['42343007','38341003','27550009','73211009','230690007', "266257000", "13713005"],
      //       var chf = pullCondition(conds, ["42343007"]); //byCodes only works w LOINC
		    // var hypertension = pullCondition(conds, ["38341003"]);
		    // var vascDisease = pullCondition(conds, ["27550009"]);
		    // var diabetes = pullCondition(conds, ["73211009"]);
		    // var strTIAthrom = pullCondition(conds, ["230690007", "266257000", "13713005"]);
        "Kidney_Failure": [],
        "COPD_Mortality": ["40917007"], //confusion
        "Diabetes": ['80394007'] //hyperglycemia
	};

export class SmokingTile extends Component {
	constructor(props) {
		super(props);
	}

	// componentDidMount(){
	// 	var codeList = riskObjectConditions[this.props.riskName];
	// 	var parentComponent = this;
	// 	$.when(this.props.conditions).done(function(conds) {

	// 	});
	// }

	// componentWillReceiveProps(nextProps) {
	// 	var parentComponent = this;
	// 	$.when(nextProps.conditions).done(function(conds) {

	// 	});
	// }

	render() {
		return (
			<div>
				<Marks smoker={this.props.smoker}/>
			</div>
		);
	}
}

class Marks extends Component {
	constructor(props) {
		super();
		this.state = {
			smoker: props.smoker
		}
	}

	render() {
		var xFill = "#030072";
		var cFill = "#AAAAAB";
		if(this.state.smoker) {
			var xFill = "#AAAAAB";
			var cFill = "#030072";
		}
		var parent = this;
		function onClick() {
			parent.setState({
				smoker: !(parent.state.smoker)
			});
		}
		return (
			<div>
				<text style={{fontSize: "30"}}>Smoking Status</text>
				<svg onClick={onClick} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" transform="translate(-40, -20) scale(0.5)">
					<polygon fill={xFill} points="96,14 82,0 48,34 14,0 0,14 34,48 0,82 14,96 48,62 82,96 96,82 62,48 "/>
					<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="100" y="-50"
	 					 viewBox="300 170 500 500" >
	 					<g transform="scale(2)">
							<path fill={cFill} d="M223.9,329.7c-2.4,2.4-5.8,4.4-8.8,4.4s-6.4-2.1-8.9-4.5l-56-56l17.8-17.8l47.2,47.2l124.8-125.7l17.5,18.1L223.9,329.7z"/>
						</g>
					</svg>
				</svg>
				
			</div>
		);
	}
}


export default SmokingTile;