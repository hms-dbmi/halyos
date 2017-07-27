import React, { Component } from 'react';
import { render } from 'react-dom';
import { VictoryArea, VictoryTooltip, VictoryGroup, VictoryScatter, createContainer, VictoryChart, VictoryLine, VictoryAxis, VictoryZoomContainer, VictoryBrushContainer, VictoryBar } from 'victory';

class PastGraph extends Component {

	constructor(props){
		super(props);
		this.state = {};
    //console.log("graph data current: ", this.props);

	}

	componentWillMount(){
		//this.setState({selectedDomain: {x: [2, 4]}})
	}

	handleZoom(domain) {
    	this.setState({selectedDomain: domain});
  	}

  	handleBrush(domain) {
    	this.setState({zoomDomain: domain});
  	}



	render(){

    const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");


return (
      <div>
          <VictoryChart width={this.props.mainWidth} height={this.props.mainHeight} scale={{x: "time"}} responsive={false}
            containerComponent={
              <VictoryZoomVoronoiContainer responsive={false} labels={(d) => `${(d.y).toFixed(2)} ${this.props.units}`}
                dimension="x"
                zoomDomain={this.state.zoomDomain}
                onDomainChange={this.handleZoom.bind(this)}
              />
            }
          >

          <VictoryArea y0={() => 80} y={() => 90}
            style={{
                data: {
                  fill: "#8BC34A", fillOpacity: 0.3, strokeWidth:0
                }
            }}
           />

        <VictoryLine data={this.props.obs_data}
              style={{
                data: {stroke: "tomato"}
              }}
              
            />

          </VictoryChart>

          <VictoryChart
            padding={{top: 0, left: 50, right: 50, bottom: 30}}
            width={this.props.viewWidth} height={this.props.viewHeight}  scale={{x: "time"}} 
            containerComponent={
              <VictoryBrushContainer responsive={false}
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

	}

}

export default PastGraph;