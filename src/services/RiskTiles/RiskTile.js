import React, { Component } from 'react';

class RiskTile extends Component {
	constructor(props) {
		super();
	}

	render() {
		var opacity = this.props.score/100;
		var link = window.location.origin + '/risk/' + this.props.url;
		return (
			<svg className="img-fluid" width="100%" height="100%" viewBox="0 0 123 118" version="1.1">
				<g>
				    
				    <text x="50%" y="20%" fontSize="vw" alignmentBaseline="middle" textAnchor="middle">{this.props.scoreName}</text>  
				    <text x="50%" y="80%" fontSize="vw" alignmentBaseline="middle" textAnchor="middle">{this.props.status}</text>  
    				<a xlinkHref={link} target="_blank">
		    			<rect width="95%" height="95%" x="2.5%" y="2.5%" rx="20" ry="20" style={{fill:'red',stroke:'#888D95',strokeWidth:3,fillOpacity:0}}/>
					</a>
					<text x="50%" y="60%" fontSize="28" alignmentBaseline="middle" textAnchor="middle">{this.state.score}{this.state.sym}</text>
					<text x="50%" y="90%" fontSize="10" alignmentBaseline="middle" textAnchor="middle">{this.state.context}</text>
			    </g>
			</svg>
		);
	}
}

export default RiskTile;