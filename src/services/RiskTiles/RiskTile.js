import React, { Component } from 'react';

class RiskTile extends Component {
	constructor(props) {
		super();
	}

	render() {
		return (
			<svg className="img-fluid" width="100%" height="100%" viewBox="0 0 123 118" version="1.1">
				<g>
				    
				    <text x="50%" y="20%" fontSize="vw" alignmentBaseline="middle" textAnchor="middle">{this.props.scoreName}</text>  
				    <text x="50%" y="80%" fontSize="vw" alignmentBaseline="middle" textAnchor="middle">{this.props.status}</text>  
				    {this.props.children}
			    </g>
			</svg>
		);
	}
}

export default RiskTile;