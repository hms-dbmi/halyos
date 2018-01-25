import React, { Component } from 'react';

import './RiskVisualization.css';

export default class RiskVisualization extends Component {
	constructor(props) {
		super(props);
	}

	createViz() {
		var code = ""
		for(var i = 0; i < 100; i++) {
			code = code + '<svg width="10" height="10">'
			code = code +  '<circle cx="5" cy="5" r="4" stroke="black" stroke-width="3" fill="red" />'
			code = code + '</svg>'
			if (i % 10 == 9) {
				code = code + '<br/>'
			}
		}
		return {__html: code};
	}

	render() {
		
		return (
			<div dangerouslySetInnerHTML={this.createViz()}>
			</div>
		);
	}

}