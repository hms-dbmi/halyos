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
		console.log(this.state)
		var code = '<svg width="100%" height="100%" viewBox="0 0 200 200"><g>'
		var i = 0
		for(i = 0; i < this.state.present; i++) {
			code = code + '<circle cx="' + Number(10+(i%10)*20).toString() + '" cy="' + Number(10+Math.floor(i/10)*20).toString() + '" r="7" stroke="black" stroke-width="0" fill="#656565" />'
			if (i % 10 === 9) {
				code = code + '</g>'
			}
		}
		console.log(i)
		for(i = i; i < this.state.present+this.state.better; i++) {
			code = code + '<circle cx="' + Number(10+(i%10)*20).toString() + '" cy="' + Number(10+Math.floor(i/10)*20).toString() + '" r="7" stroke="black" stroke-width="1" fill="#1C1C1C" />'
			code = code + '<circle cx="' + Number(10+(i%10)*20).toString() + '" cy="' + Number(10+Math.floor(i/10)*20).toString() + '" r="9" stroke="black" stroke-width="1" fill="none" />'
			// code = code +  '<circle cx="10" cy="10" r="7" stroke="black" stroke-width="1" fill="#1C1C1C" />'
			// code = code +  '<circle cx="10" cy="10" r="9" stroke="black" stroke-width="1" fill="none" />'
			if (i % 10 === 9) {
				code = code + '</g><g>'
			}
		}
		console.log(i)
		for(i = i; i < this.state.present+this.state.better+this.state.worse; i++) {
			code = code + '<circle cx="' + Number(10+(i%10)*20).toString() + '" cy="' + Number(10+Math.floor(i/10)*20).toString() + '" r="2" stroke="black" stroke-width="1" fill="#1C1C1C" />'
			//code = code +  '<circle cx="10" cy="10" r="2" stroke="black" stroke-width="1" fill="#1C1C1C" />'
			if (i % 10 === 9) {
				code = code + '</g><g>'
			}
		}
		console.log(i)
		for(i = i; i < 100; i++) {
			code = code + '<circle cx="' + Number(10+(i%10)*20).toString() + '" cy="' + Number(10+Math.floor(i/10)*20).toString() + '" r="7" stroke="black" stroke-width="0" fill="#D4D4D4" />'
			//code = code +  '<circle cx="10" cy="10" r="7" stroke="black" stroke-width="0" fill="#D4D4D4" />'
			if (i % 10 === 9) {
				code = code + '</g><g>'
			}
		}
		code = code + '</g></svg>'
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