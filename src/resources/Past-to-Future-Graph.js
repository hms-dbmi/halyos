import React, { Component } from 'react';
import { render } from 'react-dom';
import { VictoryBar, VictoryChart, VictoryGroup } from 'victory';

class PastToFutureGraph extends Component {

	constructor(props){
		super(props);

		//could be this.props.match...
		
		
		//This is how you refer to function clients passed through frmo the App.js

		/*this.search = this.props.client.api.search;
		this.search({type: "Observation", query: {subject: "99912345"}})
      			.then(function(r){ 
        			console.log("alsjdhfalsdkfjhalsdfjhasldfkjasldfajshd ",JSON.stringify(r,null,2));
	    		});
		*/
	}

	componentWillMount(){
		console.log("here we are!")
		if (this.props.match.params != null){
			this.measurement = this.props.match.params.measureName;	
		}
	}

	render(){
		return (
			<div>
				<VictoryChart>
  <VictoryGroup offset={20}
    colorScale={"qualitative"}
  >
    <VictoryBar
      data={[{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 5 }]}
    />
    <VictoryBar
      data={[{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 3, y: 7 }]}
    />
    <VictoryBar
      data={[{ x: 1, y: 3 }, { x: 2, y: 4 }, { x: 3, y: 9 }]}
    />
  </VictoryGroup>
</VictoryChart>
			</div>
		)
	}

}

export default PastToFutureGraph;