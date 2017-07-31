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

export class RelevantConditions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			conds: [<li key={'none'}>None</li>]
		};
	}

	componentDidMount(){
		var codeList = riskObjectConditions[this.props.riskName];
		var parentComponent = this;
		$.when(this.props.conditions).done(function(conds) {
			if(codeList.length != 0) {
				var condObj = pullCondition(conds, codeList);
				const condNames = [];
				for (var i in condObj) {
					condNames.push(condObj[i].code.text);
				}
				if (condNames.length == 0) {
					condNames.push("None");
				}
				const listItems = condNames.map((condName) =>
					<li key={condName}>{condName}</li>
				);
				parentComponent.setState({
					conds:listItems
				});
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		var parentComponent = this;
		$.when(nextProps.conditions).done(function(conds) {
			var codeList = riskObjectConditions[nextProps.riskName];
			if(codeList.length != 0) {
				var condObj = pullCondition(conds, codeList);
				const condNames = [];
				for (var i in condObj) {
					condNames.push(condObj[i].code.text);
				}
				if (condNames.length == 0) {
					condNames.push("None");
				}
				const listItems = condNames.map((condName) =>
					<li key={condName}>{condName}</li>
				);
				parentComponent.setState({
					conds:listItems
				});
			}
		});
	}

	render() {
		return (
			<div>
				<text style={{fontSize: "30"}}> Relevant Conditions </text>
				<div style={{fontSize: "14"}}><ol>{this.state.conds}</ol></div>
			</div>
		);
	}
}

export default RelevantConditions;