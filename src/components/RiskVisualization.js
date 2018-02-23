import React, { Component } from 'react';

import './RiskVisualization.css';

export default class RiskVisualization extends Component {
	constructor(props) {
		super(props);
		this.state = {
			present: (this.props.present > 0 ? this.props.present : 0),
			better: (this.props.better > 0 ? this.props.better : 0),
			worse: (this.props.worse > 0 ? this.props.worse : 0),
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			present: (nextProps.present > 0 ? nextProps.present : 0),
			better: (nextProps.better > 0 ? nextProps.better : 0),
			worse: (nextProps.worse > 0 ? nextProps.worse : 0),
		})
	}

	createViz() {
		var code = ""
		var count = 0
		for(var i = 0; i < this.state.present; i++) {
			count = i+1
			code = code + '<svg width="23" height="20">'
			code = code +  '<circle cx="10" cy="10" r="7" stroke="black" stroke-width="0" fill="#656565" />'
			code = code + '</svg>'
			if (i % 10 === 9) {
				code = code + '<br/>'
			}
		}
		for(i = count; i < this.state.present+this.state.better; i++) {
			count = i+1
			code = code + '<svg width="23" height="20">'
			code = code +  '<circle cx="10" cy="10" r="7" stroke="black" stroke-width="1" fill="#1C1C1C" />'
			code = code +  '<circle cx="10" cy="10" r="9" stroke="black" stroke-width="1" fill="none" />'
			code = code + '</svg>'
			if (i % 10 === 9) {
				code = code + '<br/>'
			}
		}
		for(i = count; i < this.state.present+this.state.better+this.state.worse; i++) {
			count = i+1
			code = code + '<svg width="23" height="20">'
			code = code +  '<circle cx="10" cy="10" r="2" stroke="black" stroke-width="1" fill="#1C1C1C" />'
			//code = code +  '<circle cx="10" cy="10" r="9" stroke="black" stroke-width="1" fill="none" />'
			code = code + '</svg>'
			if (i % 10 === 9) {
				code = code + '<br/>'
			}
		}
		for(i = count; i < 100; i++) {
			code = code + '<svg width="23" height="20">'
			code = code +  '<circle cx="10" cy="10" r="7" stroke="black" stroke-width="0" fill="#D4D4D4" />'
			code = code + '</svg>'
			if (i % 10 === 9) {
				code = code + '<br/>'
			}
		}
		return {__html: code};
	}

	render() {
		return (
			<div className={this.props.emphasize ? 'present-risk' : 'risk'}>
				<div className='header flex-c flex-v-bottom flex-align-sb'> {this.props.score}% <span className="time"> {this.props.period} </span></div>
				<div dangerouslySetInnerHTML={this.createViz()}/>
			</div>
		);
	}

}