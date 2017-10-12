import React, { Component } from 'react';
class PreventativeCareSuggestion extends Component {
	constructor(props) {
		super();
	}

	render() {
		return (
			<div>
				{this.props.text}
				<hr/>
			</div>
		);
	}

}
export default PreventativeCareSuggestion;