import React, { Component } from 'react';
import { render } from 'react-dom';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryZoomContainer, VictoryBrushContainer, VictoryBar } from 'victory';

class PastGraph extends Component {

	constructor(props){
		super(props);
		this.state = {};
    console.log("graph data current: ", this.props);

		
		//could be this.props.match...
		
		
		//This is how you refer to function clients passed through frmo the App.js

		/*this.search = this.props.client.api.search;
		this.search({type: "Observation", query: {subject: "99912345"}})
      			.then(function(r){ 
        			console.log("alsjdhfalsdkfjhalsdfjhasldfkjasldfajshd ",JSON.stringify(r,null,2));
	    		});
		*/
	}

	// componentWillMount(){
	// 	//this.setState({selectedDomain: {x: [2, 4]}})
	// }

	handleZoom(domain) {
    	this.setState({selectedDomain: domain});
  	}

  	handleBrush(domain) {
    	this.setState({zoomDomain: domain});
  	}

	render(){
		var MAX_VALUE = 566.5;
		var yVal = ((MAX_VALUE - 350)/2) + 350;
		var widthVal = ((MAX_VALUE - 350)/2);

		var MIN_VALUE = 112.5;
		var yVal2 = ((200- MIN_VALUE)/2) + 200;
		var widthVal2 = ((MIN_VALUE - 200)/2) + 200;
		return (
			<div>
          <VictoryChart width={1000} height={400} scale={{x: "time"}} 
            containerComponent={
              <VictoryZoomContainer responsive={true}
                dimension="x"
                zoomDomain={this.state.zoomDomain}
                onDomainChange={this.handleZoom.bind(this)}
              />
            }
          >
            <VictoryLine
              style={{
                data: {stroke: "tomato"}
              }}
              data={this.props.obs_data}
            />

{/*}             <VictoryBar horizontal
			    style={{
			      data: { fill: "#c43a31", fillOpacity: 0.1},
			      parent: { border: "1px solid #ccc"}
			    }}
			    data={[
			    	{x:yVal,y:8, width:widthVal},
			    	{x:100, y:8, width:this.range}
			    ]}
			  />

*/}
          </VictoryChart>

        <VictoryChart
            padding={{top: 0, left: 50, right: 50, bottom: 30}}
            width={1000} height={100} scale={{x: "time"}} 
            containerComponent={
              <VictoryBrushContainer responsive={true}
                dimension="x"
                selectedDomain={this.state.selectedDomain}
                onDomainChange={this.handleBrush.bind(this)}
              />
            }
          >
            <VictoryAxis
              tickValues={[
                1,2,3,4,5,6,7,8
              ]}
            />
            <VictoryLine
              style={{
                data: {stroke: "tomato"}
              }}
              data={this.props.obs_data}
            />
          </VictoryChart>
          
      </div>
		)
	}

}

export default PastGraph;