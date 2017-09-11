import React, { Component } from 'react';

class RiskTile extends Component {
	constructor(props) {
		super();
	}

	render() {
		return (
			<div>
				{this.props.scoreName} {this.props.status} {this.props.score} {this.props.sym} {this.props.context}
			</div>
		);
	}
}

export default RiskTile;