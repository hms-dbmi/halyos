import PropTypes from 'prop-types';
import React from 'react';

import * as d3 from 'd3';

// Styles
import './PastGraph.css';

const WIDTH = 600;
const HEIGHT = 140;
const HEIGHT2 = 20;
const margin = {
  top: 0, right: 0, bottom: 0, left: 0
};
const margin2 = {
  top: 160, right: 0, bottom: 0, left: 0
};

class PastGraph extends React.Component {
  constructor(props) {
    super(props);

    // Detached SVG base element
    this.svg = d3.select('body').append('svg')
      .remove()
      .attr('class', 'past-graph-svg')
      .attr('viewBox', '0 0 600 200');
  }

  /* ************************** Life Cycle Methods ************************** */
  componentDidMount() {
    this.init();
  }

  render() {
    // this.uniqueID = this.props.elemid + 'graph';
    return (
      <div className="past-graph" ref={(elem) => { this.div = elem; }} />
    );
  }

  /* ************************** Custom Methods ************************** */

  init() {
    if (!this.div) return;

    const enclosingDiv = d3.select(this.div);
    this.svg = enclosingDiv.append('svg');

    this.svg
      .attr('class', 'past-graph-svg')
      .attr('viewBox', '0 0 600 200');

    // const HEIGHT2 = +this.svg.attr('height') - margin2.top - margin2.bottom;

    // HEIGHT = +this.svg.attr('height') - margin.top - margin.bottom;
    // WIDTH = +this.svg.attr('width') - margin.left - margin.right;

    this.x = d3.scaleTime().range([0, WIDTH]);
    this.x2 = d3.scaleTime().range([0, WIDTH]);
    this.y = d3.scaleLinear().range([HEIGHT, 0]);
    this.y2 = d3.scaleLinear().range([HEIGHT2, 0]);

    const yMax = d3.max(this.props.data, d => d.y);

    // we want to create custom tick values, 8 is the max divison before you
    // can't see the numbers anymore
    const tickArray = [];
    let stepSize = Math.floor((yMax - 0) / 11);
    if (stepSize === 0) {
      stepSize = yMax / 11;
    }
    let tick = 0;
    while (tick < yMax) {
      tickArray.push(tick);
      tick += stepSize;
    }
    tickArray.push(tick);

    this.xAxis = d3.axisBottom(this.x);

    const xAxis2 = d3.axisBottom(this.x2);
    const yAxis = d3.axisLeft(this.y).tickValues(tickArray).tickSizeOuter(0);

    this.brush = d3.brushX()
      .extent([[0, 0], [WIDTH, HEIGHT2]])
      .on('brush end', this.brushed.bind(this));

    this.zoom = d3.zoom()
      .scaleExtent([1, 20])
      .translateExtent([[0, 0], [WIDTH, HEIGHT]])
      .extent([[0, 0], [WIDTH, HEIGHT]])
      .on('zoom', this.zoomed.bind(this));

    this.line = d3.line()
      .x(d => this.x(d.x))
      .y(d => this.y(d.y));

    this.line2 = d3.line()
      .x(d => this.x2(d.x))
      .y(d => this.y2(d.y));

    this.svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', WIDTH)
      .attr('height', HEIGHT);

    this.focus = this.svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.focusGraph = this.focus.append('g')
      .attr('clip-path', 'url(#clip)');

    this.context = this.svg.append('g')
      .attr('class', 'context')
      .attr('transform', `translate(${margin2.left},${margin2.top})`);

    this.pastDateArea = d3.area()
      .x(d => this.x(d.x))
      .y0(0)
      .y1(() => HEIGHT);

    this.pastDateAreaOverview = d3.area()
      .x(d => this.x2(d.x))
      .y0(0)
      .y1(HEIGHT2);

    const yMaxPadded = yMax * 1.15;
    this.x.domain(d3.extent(this.props.data, d => d.x));
    this.y.domain([0, +yMaxPadded]);
    this.x2.domain(this.x.domain());
    this.y2.domain(this.y.domain());

    this.focusGraph.append('path')
      .datum(this.props.data)
      .attr('class', 'past-graph-connection')
      .attr('d', this.line);

    this.focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${HEIGHT})`)
      .call(this.xAxis);

    this.focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    this.context.append('path')
      .datum(this.props.data)
      .attr('class', 'past-graph-connection-overview')
      .attr('d', this.line2);

    this.context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${HEIGHT2})`)
      .call(xAxis2);

    // we are setting the initial zoom to be between 5 and 95% of the total
    const rangeLength = this.x.range()[1] - this.x.range()[0];
    const bufferSize = rangeLength * 0.05;
    const initialBrushRange = [
      this.x.range()[0] + bufferSize,
      this.x.range()[1] - bufferSize
    ];

    // add scatter points
    this.focusGraph.selectAll('past-graph-node')
      .data(this.props.data)
      .enter().append('circle')
      .attr('r', 5)
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y))
      .attr('class', 'past-graph-node');

    this.context.selectAll('past-graph-node-overview')
      .data(this.props.data)
      .enter().append('circle')
      .attr('r', 3)
      .attr('cx', d => this.x2(d.x))
      .attr('cy', d => this.y2(d.y))
      .attr('class', 'past-graph-node-overview');

    this.context.append('g')
      .attr('class', 'past-graph-brush')
      .call(this.brush)
      .call(this.brush.move, initialBrushRange);

    this.svg.append('rect')
      .attr('class', 'past-graph-zoom')
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(this.zoom);

    const pastDateData = [{
      x: this.props.pastDate.toDate(),
      y: HEIGHT
    }, {
      x: this.props.pastDate.toDate(),
      y: HEIGHT
    }];

    const pastDateDataContext = [{
      x: this.props.pastDate.toDate(),
      y: HEIGHT2
    }, {
      x: this.props.pastDate.toDate(),
      y: HEIGHT2
    }];

    this.focus.append('path')
      .datum(pastDateData)
      .attr('class', 'area')
      .attr('d', this.pastDateArea)
      .attr('class', 'past-graph-date-v-bar');

    this.context.append('path')
      .datum(pastDateDataContext)
      .attr('class', 'area')
      .attr('d', this.pastDateAreaOverview)
      .attr('class', 'past-graph-date-v-bar-overview');
  }

  wrangleData() {

  }

  update() {

  }

  brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom

    const s = d3.event.selection || this.x2.range();
    this.x.domain(s.map(this.x2.invert, this.x2));

    this.focus.select('.past-graph-connection')
      .attr('d', this.line);
    this.focus.select('.past-graph-date-v-bar')
      .attr('d', this.pastDateArea);
    this.focus.selectAll('.past-graph-node')
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y));

    this.focus.select('.axis--x').call(this.xAxis);
    this.svg.select('.past-graph-zoom').call(this.zoom.transform, d3.zoomIdentity
      .scale(WIDTH / (s[1] - s[0]))
      .translate(-s[0], 0));
  }

  zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush

    const t = d3.event.transform;
    this.x.domain(t.rescaleX(this.x2).domain());

    this.focus.select('.past-graph-connection')
      .attr('d', this.line);
    this.focus.select('.past-graph-date-v-bar')
      .attr('d', this.pastDateArea);
    this.focus.selectAll('.past-graph-node')
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y));

    this.focus.select('.axis--x').call(this.xAxis);
    this.context.select('.past-graph-brush').call(this.brush.move, this.x.range().map(t.invertX, t));
  }
}

PastGraph.propTypes = {
  data: PropTypes.obj,
  pastDate: PropTypes.obj,
};

export default PastGraph;
