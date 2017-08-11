import React, { Component } from 'react';
import SkyLight from 'react-skylight';

class HelpRiskTile extends Component {
	constructor(props) {
		super();
		this.state = {
			score: "..."
		};
	}

	render() {
		return (
			<div style={{cursor:"pointer"}}>
 				<svg onClick={() => this.refs.simpleDialog.show()} width="100%" height="100%" viewBox="0 0 123 118" version="1.1">
 					<g>
 					    <rect width="95%" height="95%" x="2.5%" y="2.5%" rx="20" ry="20" style={{fill:'red',stroke:'#888D95',strokeWidth:3,fillOpacity:0}}/>
 					    <text x="50%" y="20%" fontSize="2vw" alignmentBaseline="middle" textAnchor="middle">{this.props.scoreName}</text>
 					    <text x="50%" y="60%" fontSize="3vw" alignmentBaseline="middle" textAnchor="middle">?</text>  
 				    </g>
 				</svg>
 				<SkyLight hideOnOverlayClicked ref="simpleDialog" title="What is risk? How do I interpret it?">
           			In this context, risk refers to how likely you are to develop a disease or suffer from an acute illness. Each score has slightly different meanings. {<br/>}{<br/>}
           			The Cardiac Risk Score represents the likelihood of you suffering from a major cardiac event, such as a heart attack, within the next 10 years. {<br/>}{<br/>}
           			The Stroke Score represents the likelihood of you suffering from a stroke within the next year. {<br/>}{<br/>}
           			The Kidney Failure score represents the likelihood of you developing kidney failure within the next five years. {<br/>}{<br/>}
           			The Chronic Obstructive Pulmonary Disease (COPD) Score represents the likelihood of you dying due to chronic obstructive pulmonary dieases within the next four years. {<br/>}{<br/>}
           			The Diabetes Score repsents the likelihood you will develop type II diabetes within 5 years. 
         		</SkyLight>
 			</div>
		);
	}
}

export default HelpRiskTile;