import React, { Component } from 'react';
export default class Name extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		var name = this.props.patient; //need to figure out what the name is but need to inspect patient object
		console.log(name)
		return (
			<div>
				{name} icon
			</div>
		);
	}

}