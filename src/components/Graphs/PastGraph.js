import React, { Component } from 'react';
import { render } from 'react-dom';
import { VictoryArea, VictoryTooltip, VictoryGroup, VictoryScatter, createContainer, VictoryChart, VictoryLine, VictoryAxis, VictoryZoomContainer, VictoryBrushContainer, VictoryBar } from 'victory';

import { refRangeStyle, lineStyle, yAxisStyle, xAxisStyle, scatterStyle, viewfinderLineStyle } from './PastGraph-style.js'

class PastGraph extends Component {

	constructor(props){
		super(props);
		this.state = {};
    //console.log("graph data current: ", this.props);

	}

	componentWillMount(){
		//this.setState({selectedDomain: {x: [2, 4]}})
    this.hasRefRange = false;
    if (this.props.refRange){
      this.hasRefRange = !(this.props.refRange.length == 0);
    }

    //console.log("domaiN: ", this.props.refRange);

	}

  	handleBrush(domain) {
    	this.setState({zoomDomain: domain});
  	}



	render(){

    var additional; 
            
          

    const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");
    const unitLabel = this.props.units;
    //console.log("ref", this.hasRefRange);
    //console.log("render y1", this.props.refRange[0], " '", this.props.refRange[1]);
return (
      <div>
          <VictoryChart width={this.props.mainWidth} height={this.props.mainHeight} scale={{x: "time"}} responsive={false}
            containerComponent={
              <VictoryZoomVoronoiContainer allowZoom={false}  responsive={false} 
                dimension="x"
                zoomDomain={this.state.zoomDomain}
                domain={{x: [this.props.obs_data[this.props.obs_data.length - 1].x, this.props.obs_data[0].x]}}
                domainPadding={{y:[10,10]}}
              />
            }
          >

          <VictoryAxis 
            dependentAxis
            label={"Measurements  (" + `${this.props.units}` + ")"}
            style={yAxisStyle}
          />
          
          <VictoryAxis 
            label="Date"
            style={xAxisStyle}
          />

          <VictoryScatter data={this.props.obs_data} style={scatterStyle}
          />

          {this.hasRefRange && <VictoryArea data={this.props.obs_data} y0={() => this.props.refRange[0]} y={() => this.props.refRange[1]}
            style={refRangeStyle}
           />}
          
        <VictoryLine data={this.props.obs_data} labels={(d) => `${(d.y).toFixed(2)} ${this.props.units}`} labelComponent={<VictoryTooltip/>}
              style={lineStyle}
              
            />

{/*}        <VictoryLine data={this.props.obs_data} labels={(d) => `${(d.y).toFixed(2)} ${this.props.units}`} labelComponent={<VictoryTooltip/>}
              style={{
                data: {stroke: "#673AB7"}
              }}
              
            />

        <VictoryLine data={this.props.obs_data} labels={(d) => `${(d.y).toFixed(2)} ${this.props.units}`} labelComponent={<VictoryTooltip/>}
              style={{
                data: {stroke: "#673AB7"}
              }}
              
            />

*/}
          </VictoryChart>

          <VictoryChart
            padding={{top: 0, left: 50, right: 50, bottom: 30}} 
            width={this.props.viewWidth} height={this.props.viewHeight}  scale={{x: "time"}} 
            containerComponent={
              <VictoryBrushContainer responsive={false}
                dimension="x"
                //selectedDomain={{x: [new Date(2009, 1, 1), new Date(2012, 1, 1)]}}
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
              style={viewfinderLineStyle}
              data={this.props.obs_data}
            />
          </VictoryChart>

      </div>
    );

	}

}

export default PastGraph;