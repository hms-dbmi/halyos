import React, { Component } from 'react';
import {riskTileStyle, riskTileScoreStyle} from './RiskTile-style';

class RiskTile extends Component {
	constructor(props) {
		super();
	}

	render() {
		return (
			<div style={riskTileStyle}>
				{this.props.scoreName}<br/>
				{this.props.status}<br/>
				<div style={riskTileScoreStyle}>{this.props.score} {this.props.sym} </div><br/>
				{this.props.context}
			</div>
		);
	}
}

export default RiskTile;