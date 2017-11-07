import React, { Component } from 'react';
import { render, ReactDOM } from 'react-dom';

import ReactSimpleRange from 'react-simple-range';

import { SimpleGraph } from './SimpleGraph';
import * as d3 from "d3";

// Styles
import './PastGraph.css';


class PastGraph extends Component {

  constructor(props){
    super(props);

  }

  /* ************************** Life Cycle Methods ************************** */


  
  componentDidMount() {
    var idName = "#" + this.uniqueID;
    var enclosingDiv = d3.select(idName);
    this.svg = enclosingDiv.append("svg");

    this.svg
          .attr("width", 450)
          .attr("height", 250)

    var margin = {top: 20, right: 0, bottom: 130, left: 40}, 
    margin2 = {top: 150, right: 0, bottom: 70, left: 40},
    height2 = +this.svg.attr("height") - margin2.top - margin2.bottom;


    this.height = +this.svg.attr("height") - margin.top - margin.bottom;
    this.width = +this.svg.attr("width") - margin.left - margin.right;

    this.x = d3.scaleTime().range([0, this.width]),
    this.x2 = d3.scaleTime().range([0, this.width]),
    this.y = d3.scaleLinear().range([this.height, 0]),
    this.y2 = d3.scaleLinear().range([height2, 0]);

    var data = this.props.obs_data;
    var yMax = d3.max(data, function(d) { return d.y; }.bind(this));
    // var yMin = d3.min(data, function(d) { return d.y; }.bind(this));

    
    //we want to create custom tick values, 8 is the max divison before you can't see the numbers anymore
    var tickArray = [];
    var stepSize = Math.floor((yMax - 0) / 11);
    var tick = 0;
    while(tick < yMax){
      tickArray.push(tick);
      tick = tick + stepSize;
    }
    tickArray.push(tick);



    this.xAxis = d3.axisBottom(this.x);

    var xAxis2 = d3.axisBottom(this.x2),
        yAxis = d3.axisLeft(this.y).tickValues(tickArray).tickSizeOuter(0);

    this.brush = d3.brushX()
        .extent([[0, 0], [this.width, height2]])
        .on("brush end", this.brushed.bind(this));

    this.zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [this.width, this.height]])
        .extent([[0, 0], [this.width, this.height]])
        .on("zoom", this.zoomed.bind(this));

    this.area = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return this.x(d.x); }.bind(this))
        .y0(this.height)
        .y1(function(d) { return this.y(d.y); }.bind(this));

    this.area2 = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return this.x2(d.x); }.bind(this))
        .y0(height2)
        .y1(function(d) { return this.y2(d.y); }.bind(this));

    this.pastDateArea = d3.area()
        .x(function(d) { return this.x(this.props.pastDate.toDate()) }.bind(this))
        .y0(0)
        .y1(function(d) { return this.height }.bind(this))

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
        .attr("height", this.height);

    this.focus = this.svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.context = this.svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    var yMaxPadded = yMax * 1.15;
    this.x.domain(d3.extent(data, function(d) { return d.x; }.bind(this)));
    this.y.domain([0, +yMaxPadded]);
    this.x2.domain(this.x.domain());
    this.y2.domain(this.y.domain());

    this.focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", this.area);

    //TODO: switch over to paths, currently using unfilled areas
    // focus.append("path")
    //       .datum(data)
    //       .attr("class", "line")
    //       .attr("d", valueline);

    this.focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + this.height + ")")
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

    //we will draw the previous date line below
    // this.context

    // this.focus.append("line")
    //     .attr("x1", this.x(this.props.pastDate.toDate()))  //<<== change your code here
    //     .attr("y1", 0)
    //     .attr("x2", this.x(this.props.pastDate.toDate()))  //<<== and here
    //     .attr("y2", this.height)
    //     .style("stroke-width", 2)
    //     .style("stroke", "#EE4913")
    //     .attr("class", "vertline")
    //     .style("fill", "none");

    var pastDateData = [{x:this.props.pastDate.toDate(), y:150}]
    this.focus.append("path")
        .datum(pastDateData)
        .attr("class", "area")
        .attr("d", this.pastDateArea)
    
    var rangeLength = this.x.range()[1] - this.x.range()[0];
    
    //we are setting the initial zoom to be between 5 and 95% of the total
    var bufferSize = rangeLength * 0.05;
    var initialBrushRange = [this.x.range()[0] + bufferSize, this.x.range()[1] - bufferSize];
    this.context.append("g")
        .attr("class", "brush")
        .call(this.brush)
        .call(this.brush.move, initialBrushRange);

    this.svg.append("rect")
        .attr("class", "zoom")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(this.zoom);

  }

  render(){

    this.uniqueID = this.props.elemid + "graph";
    return (
            <div id={this.uniqueID} ref={(elem) => { this.div = elem; }} />
          );

  }

  /* ************************** Custom Methods ************************** */


  brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || this.x2.range();
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

}

export default PastGraph;
