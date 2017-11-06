import React, { Component } from 'react';
import { render, ReactDOM } from 'react-dom';
import { VictoryArea, VictoryTooltip, VictoryGroup, VictoryScatter, createContainer, VictoryChart, VictoryLine, VictoryAxis, VictoryZoomContainer, VictoryBrushContainer, VictoryBar, VictoryContainer, VictoryVoronoiContainer, VictoryLabel } from 'victory';

import { refRangeStyle, lineStyle, yAxisStyle, xAxisStyle, scatterStyle, viewfinderLineStyle } from './Past-Graph-style.js'
import ReactSimpleRange from 'react-simple-range';

import { SimpleGraph } from './SimpleGraph';
// import { select } from 'd3-selection';
// import { scaleLinear } from 'd3-scale';
// import { zoom } from 'd3-zoom';
import * as d3 from "d3";

// Styles
import './PastGraph.css';


class PastGraph extends Component {

  constructor(props){
    super(props);

  }

  /* ************************** Life Cycle Methods ************************** */


  
  componentDidMount() {
    console.log("d3", d3)
    console.log("this.unique", this.div);
    var idName = "#" + this.uniqueID;
    var enclosingDiv = d3.select(idName);
    console.log("enclosingDiv", enclosingDiv);
    this.svg = enclosingDiv.append("svg");

//width="960" height="500"
    this.svg
          .attr("width", 450)
          .attr("height", 250)
          // .attr("width", 960)
          // .attr("height", 500)

    // this.svg = d3.select("svg");

    // var margin = {top: 20, right: 20, bottom: 110, left: 40},
    // margin2 = {top: 430, right: 20, bottom: 30, left: 40},

    var margin = {top: 20, right: 0, bottom: 130, left: 40}, 
    margin2 = {top: 150, right: 0, bottom: 70, left: 40},    
    height = +this.svg.attr("height") - margin.top - margin.bottom,
    height2 = +this.svg.attr("height") - margin2.top - margin2.bottom;

    this.width = +this.svg.attr("width") - margin.left - margin.right;


    this.parseDate = d3.timeParse("%b %Y");

    this.x = d3.scaleTime().range([0, this.width]),
    this.x2 = d3.scaleTime().range([0, this.width]),
    this.y = d3.scaleLinear().range([height, 0]),
    this.y2 = d3.scaleLinear().range([height2, 0]);

    console.log("this.x", this.x);
    this.xAxis = d3.axisBottom(this.x);

    var xAxis2 = d3.axisBottom(this.x2),
        yAxis = d3.axisLeft(this.y);

    this.brush = d3.brushX()
        .extent([[0, 0], [this.width, height2]])
        .on("brush end", this.brushed.bind(this));

    this.zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [this.width, height]])
        .extent([[0, 0], [this.width, height]])
        .on("zoom", this.zoomed.bind(this));

    this.area = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return this.x(d.x); }.bind(this))
        .y0(height)
        .y1(function(d) { return this.y(d.y); }.bind(this));

    this.area2 = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return this.x2(d.x); }.bind(this))
        .y0(height2)
        .y1(function(d) { return this.y2(d.y); }.bind(this));

    var valueline = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return this.x(d.x); }.bind(this))
        .y(function(d) { return this.y(d.y); }.bind(this));

    var valueline2 = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return this.x2(d.x); }.bind(this))
        .y(function(d) { return this.y2(d.y); }.bind(this));

    this.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", this.width)
        .attr("height", height);

    this.focus = this.svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.context = this.svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var data = [];
    console.log("obs data", this.props.obs_data)
    for (var i = 0; i < this.props.obs_data.length; i++){
      var temp = this.type(this.props.obs_data[i]);
      data[i] = temp
    }
    // var data = this.props.obs_data;

    // console.log("initial")
    // d3.csv("sp500.csv", this.type, function(error, data) {
      // if (error) throw error;

    this.x.domain(d3.extent(data, function(d) { return d.x; }.bind(this)));
    this.y.domain([0, d3.max(data, function(d) { return d.y; }.bind(this)) + 30]);
    this.x2.domain(this.x.domain());
    this.y2.domain(this.y.domain());

    console.log("data", data);

    this.focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", this.area);

    // focus.append("path")
    //       .datum(data)
    //       .attr("class", "line")
    //       .attr("d", valueline);

    this.focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(this.xAxis);

    this.focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    this.context.append("path")
        .datum(data)
        // .attr("class", "line")
        // .attr("d", valueline2);      
        .attr("class", "area")
        .attr("d", this.area2);

    this.context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    this.context.append("g")
        .attr("class", "brush")
        .call(this.brush)
        //TODO
        .call(this.brush.move, this.x.range());

    this.svg.append("rect")
        .attr("class", "zoom")
        .attr("width", this.width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(this.zoom);
    // });

  }

  componentDidUpdate() {
  }

  componentWillUnmount(){
    console.log("thisvis dismount", this.div);
    var parent = this.div;
    // var parent = this.vis.node().parentNode.parentNode;
    // parent.removeChild(child);

  }

  render(){

    // return <svg ref={node => this.node = node}
    //   width={500} height={500}>
    //   </svg>
    console.log("this.div", this.div)
    this.uniqueID = this.props.elemid + "graph";
    console.log("key", this.uniqueID);
    return (
            <div id={this.uniqueID} ref={(elem) => { this.div = elem; }} />
          );

  }

  /* ************************** Custom Methods ************************** */


  brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || this.x2.range();

    console.log("this", this)
    this.x.domain(s.map(this.x2.invert, this.x2));
    this.focus.select(".area").attr("d", this.area);
    this.focus.select(".axis--x").call(this.xAxis);
    this.svg.select(".zoom").call(this.zoom.transform, d3.zoomIdentity
        .scale(this.width / (s[1] - s[0]))
        .translate(-s[0], 0));
  }

  zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    this.x.domain(t.rescaleX(this.x2).domain());
    this.focus.select(".area").attr("d", this.area);
    this.focus.select(".axis--x").call(this.xAxis);
    this.context.select(".brush").call(this.brush.move, this.x.range().map(t.invertX, t));
  }

  type(d) {
    d.date = this.parseDate(d.date);
    d.price = +d.price;
    return d;
  }
  
}

export default PastGraph;
