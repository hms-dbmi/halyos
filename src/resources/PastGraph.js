import React, { Component } from 'react';
import { render } from 'react-dom';
import { createContainer, VictoryChart, VictoryLine, VictoryAxis, VictoryZoomContainer, VictoryBrushContainer, VictoryBar } from 'victory';

class PastGraph extends Component {

	constructor(props){
		super(props);
		this.state = {};
    //console.log("graph data current: ", this.props);

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

    console.log("all the datas: ", this.props.obs_data);
    const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");



    //console.log("this is the past graph data: -------", this.props.obs_data);

return (
      <div>
          <VictoryChart width={1000} height={400} scale={{x: "time"}} 
            containerComponent={
              <VictoryZoomVoronoiContainer responsive={true} labels={(d) => `${(d.y).toFixed(2)} ${this.props.units}`}
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
              // tickValues={[
              //   new Date(2012, 1, 1),
              //   new Date(2013, 1, 1),
              //   new Date(2014, 1, 1),
              //   new Date(2015, 1, 1),
              //   new Date(2016, 1, 1),
              //   new Date(2017, 1, 1),
              //   new Date(2018, 1, 1)
              // ]}
              // tickFormat={(x) => new Date(x).getFullYear()}
            />
            <VictoryLine
              style={{
                data: {stroke: "tomato"}
              }}
              data={this.props.obs_data}
            />
          </VictoryChart>

      </div>
    );







//this is currently not working, but in progress
	// 	return (
	// 		<div>
 //          <VictoryChart width={1000} height={400} scale={{x: "time"}} 
 //            containerComponent={
 //              <VictoryZoomContainer responsive={true}
 //                dimension="x"
 //                zoomDomain={this.state.zoomDomain}
 //                onDomainChange={this.handleZoom.bind(this)}
 //              />
 //            }
 //          >
 //            <VictoryLine
 //              style={{
 //                data: {stroke: "tomato"}
 //              }}
 //              data={this.props.obs_data}
 //            />

 //      {}             <VictoryBar horizontal
	// 		    style={{
	// 		      data: { fill: "#c43a31", fillOpacity: 0.1},
	// 		      parent: { border: "1px solid #ccc"}
	// 		    }}
	// 		    data={[
	// 		    	{x:yVal,y:8, width:widthVal},
	// 		    	{x:100, y:8, width:this.range}
	// 		    ]}
	// 		  />

 //      }
 //          </VictoryChart>

 //        <VictoryChart
 //            padding={{top: 0, left: 50, right: 50, bottom: 30}}
 //            width={1000} height={100} scale={{x: "time"}} 
 //            containerComponent={
 //              <VictoryBrushContainer responsive={true}
 //                dimension="x"
 //                selectedDomain={this.state.selectedDomain}
 //                onDomainChange={this.handleBrush.bind(this)}
 //              />
 //            }
 //          >
 //            <VictoryAxis
 //              tickValues={[
 //                2012,2013,2014,2015,2016,2017
 //              ]}
 //            />
 //            <VictoryLine
 //              style={{
 //                data: {stroke: "tomato"}
 //              }}
 //              data={this.props.obs_data}
 //            />
 //          </VictoryChart>

 //      </div>
	// 	)
	}

}

export default PastGraph;