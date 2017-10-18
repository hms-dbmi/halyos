import React, { Component } from 'react';
import Person from './logos/person.js';

export default class Name extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const name = this.props.patient; //need to figure out what the name is but need to inspect patient object
		return (
			<div style={{"display":"flex", "flex-direction":"row", "align-items":"center", "padding-top":"10px", "padding-right":"50px"}}>
				{name} &nbsp;&nbsp; <Person/>
			</div>
		);
	}

}