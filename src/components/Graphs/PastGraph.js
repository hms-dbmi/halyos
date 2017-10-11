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
    var i = 1;
    var minx = this.props.obs_data[0].x;
    var maxx = this.props.obs_data[0].x;
    var miny = this.props.obs_data[0].y;
    var maxy = this.props.obs_data[0].y;
    console.log(this.props.obs_data.length)
    while (i < this.props.obs_data.length) {
      console.log(this.props.obs_data[i])
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
return (
      <div>

          <VictoryChart width={this.props.mainWidth} height={this.props.mainHeight} scale={{x: "time"}} responsive={false}
            containerComponent={
              <VictoryZoomVoronoiContainer allowZoom={false}  responsive={false} 
                dimension="x"
                zoomDomain={this.state.zoomDomain}
                domain={{x: [minx, maxx], y: [miny-0.02*miny, maxy+0.02*maxy]}}
                domainPadding={{y:[10,10]}}
              />
            }
          >
            <VictoryArea style={{data:{fill: "#DCDCDC"}}} data=
            {[{x:minx, y:this.props.reference_range.max, y0: this.props.reference_range.min},
            {x:maxx, y:this.props.reference_range.max, y0: this.props.reference_range.min}]}/>
            
            <VictoryAxis 
              dependentAxis
              label={"Measurements  (" + `${this.props.units}` + ")"}
              style={yAxisStyle}
            />
            
            <VictoryAxis 
              label="Date"
              style={xAxisStyle}
            />

            <VictoryScatter data={this.props.obs_data} style={scatterStyle}/>

            {this.hasRefRange && <VictoryArea data={this.props.obs_data} y0={() => this.props.refRange[0]} y={() => this.props.refRange[1]}
              style={refRangeStyle}
             />}
            
            <VictoryLine data={this.props.obs_data} labels={(d) => `${(d.y).toFixed(2)} ${this.props.units}`} labelComponent={<VictoryTooltip/>}
                style={lineStyle}
                
              />


        </VictoryChart>
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