import React, { Component } from 'react';
import { render } from 'react-dom';
import { VictoryArea, VictoryTooltip, VictoryGroup, VictoryScatter, createContainer, VictoryChart, VictoryLine, VictoryAxis, VictoryZoomContainer, VictoryBrushContainer, VictoryBar, VictoryContainer, VictoryVoronoiContainer } from 'victory';

import { refRangeStyle, lineStyle, yAxisStyle, xAxisStyle, scatterStyle, viewfinderLineStyle } from './Past-Graph-style.js'
import ReactSimpleRange from 'react-simple-range';

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
    var i = 1;
    var minx = this.props.obs_data[0].x;
    var maxx = this.props.obs_data[0].x;
    var miny = this.props.obs_data[0].y;
    var maxy = this.props.obs_data[0].y;
    while (i < this.props.obs_data.length) {
      if (this.props.obs_data[i].x < minx) {
        minx = this.props.obs_data[i].x
      }
      if (this.props.obs_data[i].x > maxx) {
        maxx = this.props.obs_data[i].x
      }
      if (this.props.obs_data[i].y < miny) {
        miny = this.props.obs_data[i].y
      }
      if (this.props.obs_data[i].y > maxy) {
        maxy = this.props.obs_data[i].y
      }
      i = i + 1
    }
    if(this.props.reference_range.min < miny) {
      miny = this.props.reference_range.min
    }
    if(this.props.reference_range.min > maxy) {
      maxy = this.props.reference_range.max
    }
    this.setState({maxx:maxx, minx:minx, miny:miny, maxy:maxy})
    //console.log("domaiN: ", this.props.refRange);

	}

  	handleBrush(domain) {
      const zoomDomain = {x: domain['x'], y:[this.state.miny*0.98, this.state.maxy*1.02]};
    	this.setState({zoomDomain: zoomDomain});
  	}



	render(){

    var additional; 
            
          

    const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");
    const unitLabel = this.props.units;
    //console.log("ref", this.hasRefRange);
    //console.log("render y1", this.props.refRange[0], " '", this.props.refRange[1]);
return (
  <div>
    <div style={{"display":"flex", "flex-direction":"row", "align-items":"center"}}>
      <div style={{order: "1"}}>
        <VictoryChart width={this.props.mainWidth} height={this.props.mainHeight} scale={{x: "time"}} responsive={false}
          containerComponent={
            <VictoryZoomVoronoiContainer allowZoom={false}  responsive={false} 
              dimension="x"
              zoomDomain={this.state.zoomDomain}
              domain={{x: [this.state.minx, this.state.maxx], y: [this.state.miny-0.02*this.state.miny, this.state.maxy+0.02*this.state.maxy]}}
            />
          }
        >
          <VictoryArea style={{data:{fill: "#DCDCDC"}}} data=
          {[{x:this.state.minx, y:this.props.reference_range.max, y0: this.props.reference_range.min},
          {x:this.state.maxx, y:this.props.reference_range.max, y0: this.props.reference_range.min}]}/>
            
          <VictoryAxis 
            dependentAxis
            label={"Measurements  (" + `${this.props.units}` + ")"}
            style={yAxisStyle}
            domain={[this.state.miny, this.state.maxy]}
          />
            
          <VictoryAxis 
            label="Date"
            style={xAxisStyle}
            domain={[this.state.minx, this.state.maxx]}
          />

          <VictoryScatter data={this.props.obs_data} style={scatterStyle}/>

          {this.hasRefRange && <VictoryArea data={this.props.obs_data} y0={() => this.props.refRange[0]} y={() => this.props.refRange[1]}
            style={refRangeStyle}
           />}
          
          <VictoryLine data={this.props.obs_data} labels={(d) => `${(d.y).toFixed(2)} ${this.props.units}`} labelComponent={<VictoryTooltip/>}
              style={lineStyle}
              
            />
        </VictoryChart>
      </div>
      <div style={{order: "2"}}>
        <VictoryScatter 
          width={100} height={this.props.mainHeight}
          containerComponent={<VictoryContainer responsive={false} 
                              domain={{x: [this.state.minx, this.state.maxx], y: [0.98*this.state.miny, 1.02*this.state.maxy]}}
                              />} 
          data={[{x: 0, y: this.state.miny, fill: "white", size:0}, {x: 0, y: this.state.maxy, fill: "white", size:0}, {x: 0, y: this.props.obs_data[this.props.obs_data.length-1].y-1, fill: "black", size:10}]}
        />
      </div>

      <div style={{order: "3"}}>
        <ReactSimpleRange label vertical/>
      </div>

    </div>

        <br/>
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
          <VictoryAxis/>
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