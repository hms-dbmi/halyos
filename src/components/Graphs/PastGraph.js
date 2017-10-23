import React, { Component } from 'react';
import d3 from 'd3';
import {SimpleGraph} from './SimpleGraph';

class PastGraph extends Component {

	constructor(props){
		super(props);
		this.state = {};

	}

	render(){
    return(
      <div>
        {SimpleGraph("chart1", {
          "xmax": 60, "xmin": 0,
          "ymax": 40, "ymin": 0, 
          "title": "Simple Graph1",
          "xlabel": "X Axis",
          "ylabel": "Y Axis"  
        })}
      </div>
    );

  }
}

export default PastGraph;