import React, { Component } from 'react';
import {riskTileStyle, riskTileScoreStyle} from './RiskTile-style';

class RiskTile extends Component {
	constructor(props) {
		super();
	}

	render() {
		return (
			<div style={riskTileStyle}>
				<div style={{"order":"1"}}>
					{this.props.scoreName}
				</div>
				<div style={{"order":"2"}}>
					<text style={{"font-size":"80px"}}>{this.props.score}</text><text style={{"font-size":"50px"}}>{this.props.sym} </text>
				</div>
				<div style={{"display":"flex", "flex-direction":"row", "justify-content":"space-between", "align-items":"flex-end", "order":"3", "padding-left":"5px", "padding-right":"5px"}}>
					<div style={{"order": "1"}}>
						<text style={{"font-size":"14px"}}>{this.props.context}</text>
					</div>
					<div style={{"order": "2"}}>
						<svg height="30" width ="30">
							<circle cx="15" cy="15" r="15" stroke="grey" strokeWidth="1" fill="none"/>
								<text x="50%" y="50%" textAnchor="middle" alignmentBaseline="middle" fontFamily="Merriweather" fontStyle="italic" fill="grey" >i</text>
						</svg>
					</div>	
				</div>
			</div>
		);
	}
}

export default RiskTile;