import React, { Component } from 'react';

import PastToFutureGraph from '../resources/Past-to-Future-Graph.js';

class RiskScoreView extends Component {

	constructor(props){
		super(props);

	}

	render(){
		return (
			<div>
				<PastToFutureGraph />
			</div>
		)
	}

}

export default RiskScoreView;