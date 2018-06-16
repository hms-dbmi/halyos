import PropTypes from 'prop-types';
import React from 'react';

import * as d3 from 'd3';

// Styles
import './PastGraph.css';
//Utils
import {sortGraphDataByDate} from '../services/general_utils';

const WIDTH = 650; // 560 + 40 + 50 === 650
const HEIGHT = 140;
const HEIGHT2 = 20;
const margin = {
  top: 0, right: 0, bottom: 0, left: 40
};
const margin2 = {
  top: 160, right: 0, bottom: 0, left: 40
};

const augmentPastGraphNode = (presentDate, measurementPastDate) => (
  function augmentPastGraphNodeClb(d) {
    const point = d3.select(this);
    if (d.x === presentDate) {
      point.attr('class', 'last-point past-graph-node');
    } else if (d.x.getTime() === measurementPastDate.getTime()) {
      point.attr('class', 'past-point past-graph-node');
    } else {
      point.attr('class', 'other-points past-graph-node');
    }
    //point.append('svg:title').text(function(d){return d.x;});
  }
);

class PastGraph extends React.Component {
  constructor(props) {
    super(props);
    // Detached SVG base element
    this.state = {
      data: sortGraphDataByDate(this.props.data)
    }
    this.svg = d3.select('body').append('svg')
      .remove()
      .attr('class', 'past-graph-svg')
      .attr('viewBox', '0 0 620 200');
  }

  /* ************************** Life Cycle Methods ************************** */
  shouldComponentUpdate() {
    if (this.changedFutureValue) {
      this.changedFutureValue = false;
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.width = this.props.absWidth - 150;
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    this.width = nextProps.absWidth - 150;
    this.update(nextProps);

    
  }

  render() {
    return (
      <div className="past-graph">
        <div
          ref={(elem) => { this.baseEl = elem; }}
        />
        <div className="reset-btn-container flex-c flex-align-c">
          <button
            className="reset-btn"
            onClick={this.setPresent.bind(this)}>
            Reset
          </button>
        </div>
      </div>
    );
  }

  /* ************************** Custom Methods ************************** */

  init(absWidth = this.props.absWidth) {

    if (!this.baseEl) return;

    while (this.baseEl.firstChild) {
      this.baseEl.removeChild(this.baseEl.firstChild);
    }

    this.svg = d3.select(this.baseEl).append('svg');

    this.svg
      .attr('class', 'past-graph-svg')
      .attr('viewBox', `0 0 ${absWidth} 200`);

    this.x = d3.scaleTime().range([0, this.width]);
    this.x2 = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleLinear().range([HEIGHT, 0]);
    this.y2 = d3.scaleLinear().range([HEIGHT2, 0]);
    let yMin;
    let yMax;
    if (this.props.referenceRange) {
      yMax = Math.max(d3.max(this.state.data, d => d.y), this.props.referenceRange[1]);
      yMin = Math.min(d3.min(this.state.data, d => d.y), this.props.referenceRange[0]);
    } else {
      yMax = d3.max(this.state.data, d => d.y);
      yMin = d3.min(this.state.data, d => d.y);
    }

    const yMaxPadded = Math.abs(yMax * 0.25) + yMax;
    const yMinPadded = yMin - Math.abs(yMin * 0.25);
    // we want to create custom tick values, 8 is the max divison before you
    // can't see the numbers anymore
    const tickArray = [];
    let stepSize = Math.floor((yMax - 0) / 11);
    if (stepSize === 0) {
      stepSize = yMax / 11;
    }
    let tick = 0;
    while (tick < yMaxPadded * 0.9) {
      if (tick >= yMinPadded) {
        tickArray.push(tick);
      }
      tick += stepSize;
    }
    tickArray.push(tick);

    this.xAxis = d3.axisBottom(this.x);

    const xAxis2 = d3.axisBottom(this.x2);
    const yAxis = d3.axisLeft(this.y).tickValues(tickArray).tickSizeOuter(0);

    this.brush = d3.brushX()
      .extent([[0, 0], [this.width, HEIGHT2]])
      .on('brush', this.brushed.bind(this));

    this.zoom = d3.zoom()
      .scaleExtent([1, 20])
      .translateExtent([[0, 0], [this.width, HEIGHT]])
      .extent([[0, 0], [this.width, HEIGHT]])
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
      .attr('width', this.width + 5)
      .attr('height', HEIGHT);

    this.focus = this.svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.focusGraph = this.focus.append('g')
      .attr('clip-path', 'url(#clip)');

    if(this.state.data.length > 1) {
      this.context = this.svg.append('g')
        .attr('class', 'context')
        .attr('transform', `translate(${margin2.left},${margin2.top})`);
    }

    this.pastDateArea = d3.area()
      .x(d => this.x(d.x))
      .y0(0)
      .y1(HEIGHT);

    this.pastDateAreaOverview = d3.area()
      .x(d => this.x2(d.x))
      .y0(0)
      .y1(HEIGHT2);

    // Add three months padding to the left, i.e., the first measurement
    const dateExtent = d3.extent(this.state.data, d => d.x);
    const firstDate = new Date(dateExtent[0]);
    firstDate.setMonth(firstDate.getMonth() - 3);
    dateExtent[0] = firstDate;

    this.x.domain(dateExtent);
    this.y.domain([+yMinPadded, +yMaxPadded]);
    this.x2.domain(this.x.domain());
    this.y2.domain(this.y.domain());

    this.focusGraph.append('path')
      .datum(this.state.data)
      .attr('class', 'past-graph-connection')
      .attr('d', this.line);

    this.focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${HEIGHT})`)
      .call(this.xAxis);

    this.focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    if(this.state.data.length > 1) {
      this.context.append('path')
        .datum(this.state.data)
        .attr('class', 'past-graph-connection-overview')
        .attr('d', this.line2);

      this.context.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${HEIGHT2})`)
        .call(xAxis2);
    }



    // we are setting the initial zoom to be between 5 and 95% of the total
    const rangeLength = this.x.range()[1] - this.x.range()[0];
    const bufferSize = rangeLength * 0.05 * 0;
    const initialBrushRange = [
      this.x.range()[0] + bufferSize,
      this.x.range()[1] - bufferSize
    ];

    const presentDate = this.state.data[0].x;
    // add scatter points
    const measurementPastDate = new Date(this.props.pastDateMeasurement);
    const pastDateVal = this.state.data
      .find(meas => meas.x.getTime() === measurementPastDate.getTime());
    const graphFindPastNode = augmentPastGraphNode(
      presentDate, measurementPastDate
    );

    var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .text("a simple tooltip");

    this.focusGraph.selectAll('.past-graph-node')
      .data(this.state.data)
      .enter().append('circle')
      .attr('r', 5)
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y))
      .on("mouseover", function(d){
        tooltip.text(d.x)
        tooltip.style("visibility", "visible");})
      .on("mouseout", function(d){
        tooltip.style("visibility", "hidden");})
      .each(graphFindPastNode);


    if (this.props.referenceRange) {
      // const minRef = [
      //   { x: this.x.domain()[0], y: this.props.referenceRange[0] },
      //   { x: this.x.domain()[1], y: this.props.referenceRange[0] },
      // ];
      // const maxRef = [
      //   { x: this.x.domain()[0], y: this.props.referenceRange[1] },
      //   { x: this.x.domain()[1], y: this.props.referenceRange[1] },
      // ];
      // this.focusGraph.append('path')
      //   .datum(minRef)
      //   .attr('class', 'past-graph-connection')
      //   .attr('d', this.line);

      // this.focusGraph.append('path')
      //   .datum(maxRef)
      //   .attr('class', 'past-graph-connection')
      //   .attr('d', this.line);

      this.focusGraph.append('rect')
        .attr('x', this.x.domain()[0])
        .attr('y', this.y.range()[0]/(yMaxPadded-yMinPadded)*(yMaxPadded-this.props.referenceRange[1]))
        .attr('height', this.y.range()[0]/(yMaxPadded-yMinPadded)*(this.props.referenceRange[1]-this.props.referenceRange[0]))
        .attr('width', this.x.domain()[1]-this.x.domain()[0])
        .attr('fill', '#98FB98')
        .attr('opacity', 0.2)
        .attr('id', 'test')
    }

    if(this.state.data.length > 1){
      this.context.selectAll('past-graph-node-overview')
        .data(this.state.data)
        .enter().append('circle')
        .attr('r', 3)
        .attr('cx', d => this.x2(d.x))
        .attr('cy', d => this.y2(d.y))
        .attr('class', 'past-graph-node-overview')
        .each(graphFindPastNode);

      this.context.append('g')
        .attr('class', 'past-graph-brush')
        .call(this.brush)
        .call(this.brush.move, initialBrushRange);
    }


    this.svg.append('rect')
      .attr('class', 'past-graph-zoom')
      .attr('width', this.width)
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
    
    if(pastDateVal) {
      this.pastDateAreaPointLine = {
      x1: pastDateData[0].x,
      y1: pastDateVal.y,
      x2: pastDateVal.x,
      y2: pastDateVal.y,
    };


    }
    this.focus.append('path')
      .datum(pastDateData)
      .attr('d', this.pastDateArea)
      .attr('class', 'past-graph-date-v-bar');

    //Dotted line to connect nearest measurement to verticle date line
    //Only if the dotted line will remain in the graph!
    if(pastDateData[0].x > dateExtent[0] && pastDateData[0].x < dateExtent[1]) {
      this.focus.append('line')
        .attr('class', 'graph-past-bar-point-line')
        .attr('x1', this.x(pastDateData[0].x))
        .attr('y1', this.y(pastDateVal.y))
        .attr('x2', this.x(pastDateVal.x))
        .attr('y2', this.y(pastDateVal.y))
        .attr('id', 'past-line');
    }

    if(this.state.data.length > 1){ 
      this.context.append('path')
        .datum(pastDateDataContext)
        .attr('d', this.pastDateAreaOverview)
        .attr('class', 'past-graph-date-v-bar-overview');
    }

    this.initFuture();
    // console.log(this.focusGraph.select('#test'))
  }

  initFuture() {
    this.future = this.svg.insert('g', ':first-child')
      .attr('class', 'past-graph-future')
      .attr('transform', `translate(${margin.left + this.width}, 0)`);

    this.presentFutureLine = this.future.append('line')
      .attr('class', 'graph-present-future-line')
      .attr('x1', 0)
      .attr('y1', this.y(this.state.data[0].y))
      .attr('x2', 100)
      .attr('y2', this.y(this.props.futureValue));

    this.future.append('line')
      .attr('class', 'graph-future-slider-bar')
      .attr('x1', 100)
      .attr('x2', 100)
      .attr('y1', 0)
      .attr('y2', HEIGHT);

    if (this.props.futureValue === this.props.present) {
      this.futureNode = this.future.append('circle')
        .attr('class', 'graph-future-node-unchanged')
        .attr('cx', 100)
        .attr('cy', this.y(this.props.futureValue));
    } else {
      this.futureNode = this.future.append('circle')
        .attr('class', 'graph-future-node')
        .attr('cx', 100)
        .attr('cy', this.y(this.props.futureValue));
    }

    this.futureNodeSelection = this.future.append('circle')
      .attr('class', 'graph-future-node-selection')
      .attr('r', 12)
      .attr('cx', 100)
      .attr('cy', this.y(this.props.futureValue))
      .on('mouseenter', () => this.futureNode.classed('hover', true))
      .on('mouseleave', () => this.futureNode.classed('hover', false))
      .call(d3.drag()
        .on('start', this.dragStartedFuture.bind(this))
        .on('drag', this.draggedFuture.bind(this))
        .on('end', this.dragEndedFuture.bind(this))
      );
  }

  dragStartedFuture() {
    this.futureNode.classed('active', true);
    this.futureNodeSelection.raise();
    this.props.activeMeasureHandler(this.props.code);
  }

  draggedFuture() {
    this.changedFutureValue = true;
    const newFutureValue = Math.min(
      this.y.domain()[1],
      Math.max(this.y.domain()[0], this.y.invert(d3.event.y))
    );
    const newCy = this.y(newFutureValue);
    this.props.futureChangeHandler(newFutureValue);

    this.futureNode.attr('cy', newCy);
    this.futureNodeSelection.attr('cy', newCy);
    this.presentFutureLine.attr('y2', newCy);
  }

  dragEndedFuture() {
    this.futureNode.classed('active', false);
    this.futureNode.attr('class', 'graph-future-node');
    this.props.activeMeasureHandler(null);
  }

  wrangleData() {}

  update(nextProps) {
    if (this.props.absWidth !== nextProps.absWidth) {
      this.init(nextProps.absWidth);
    } else {
      // update the vert. lines on new set Past date

      const dateExtent = d3.extent(nextProps.data, d => d.x);
      const firstDate = new Date(dateExtent[0]);
      firstDate.setMonth(firstDate.getMonth() - 3);
      dateExtent[0] = firstDate;
      const measurementPastDate = new Date(nextProps.pastDateMeasurement);
      const pastDateVal = nextProps.data
        .find(meas => meas.x.getTime() === measurementPastDate.getTime());
      const pastDateData = [{
        x: nextProps.pastDate.toDate(),
        y: HEIGHT
      }, {
        x: nextProps.pastDate.toDate(),
        y: HEIGHT
      }];

      if(pastDateVal) {
        this.pastDateAreaPointLine = {
          x1: pastDateData[0].x,
          y1: pastDateVal.y,
          x2: pastDateVal.x,
          y2: pastDateVal.y,
        };
      }

      const pastDateDataContext = [{
        x: nextProps.pastDate.toDate(),
        y: HEIGHT2
      }, {
        x: nextProps.pastDate.toDate(),
        y: HEIGHT2
      }];

      this.focus.select('.past-graph-date-v-bar')
        .datum(pastDateData)
        .attr('d', this.pastDateArea)
        .attr('class', 'past-graph-date-v-bar');

      this.svg.select('.context').select('.past-graph-date-v-bar-overview')
        .datum(pastDateDataContext)
        .attr('d', this.pastDateAreaOverview)
        .attr('class', 'past-graph-date-v-bar-overview');

      const presentDate = nextProps.data[0].x;
      // TO DO:  update color of scatter points
      this.focusGraph.selectAll('.past-graph-node')
        .attr('r', 5)
        .attr('cx', d => this.x(d.x))
        .attr('cy', d => this.y(d.y))
        .each(augmentPastGraphNode(presentDate, measurementPastDate));

      //update the horizontal line  
      if(pastDateData[0].x > dateExtent[0] && pastDateData[0].x < dateExtent[1]) {
        if(!this.focus.select('#past-line').empty()) {
          this.focus.select('#past-line')
            .attr('class', 'graph-past-bar-point-line')
            .attr('x1', this.x(pastDateData[0].x))
            .attr('y1', this.y(pastDateVal.y))
            .attr('x2', this.x(pastDateVal.x))
            .attr('y2', this.y(pastDateVal.y));
          } else {
            this.focus.append('line')
              .attr('class', 'graph-past-bar-point-line')
              .attr('x1', this.x(pastDateData[0].x))
              .attr('y1', this.y(pastDateVal.y))
              .attr('x2', this.x(pastDateVal.x))
              .attr('y2', this.y(pastDateVal.y))
              .attr('id', 'past-line');
          }
      } else {
        this.focus.select('#past-line').remove()
      }
    }
  }

  brushed() {
    // ignore brush-by-zoom
    if (
      !d3.event.sourceEvent ||
      (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom')
    ) return;
    const s = d3.event.selection || this.x2.range();
    this.x.domain(s.map(this.x2.invert, this.x2));

    this.focus.select('.past-graph-connection')
      .attr('d', this.line);
    this.focus.select('.past-graph-date-v-bar')
      .attr('d', this.pastDateArea);
    this.focus.selectAll('.past-graph-node')
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y));

    var myScale = d3.scaleLinear()
      .domain([this.x.domain()[0],this.x.domain()[1]])
      .range([this.x.range()[0], this.x.range()[1]]);

    this.focus.select('.graph-past-bar-point-line')
      .attr('x1', Math.max(0,Math.min(myScale(this.pastDateAreaPointLine.x1), myScale(this.x.domain()[1]))))
      .attr('y1', this.y(this.pastDateAreaPointLine.y1))
      .attr('x2', Math.max(0,Math.min(myScale(this.pastDateAreaPointLine.x2), myScale(this.x.domain()[1]))))
      .attr('y2', this.y(this.pastDateAreaPointLine.y2))
    
    //set opacity of line to 0 if outside of range


    this.focus.select('.axis--x').call(this.xAxis);
    this.svg.select('.past-graph-zoom').call(
      this.zoom.transform,
      d3.zoomIdentity
        .scale(this.width / (s[1] - s[0]))
        .translate(-s[0], 0)
    );
  }

  setPresent() {
    const newFutureValue = this.props.present;
    const newCy = this.y(newFutureValue);
    this.props.futureChangeHandler(newFutureValue);
    this.futureNode.attr('cy', newCy);
    this.futureNode.attr('class', 'graph-future-node-unchanged');
    this.futureNodeSelection.attr('cy', newCy);
    this.presentFutureLine.attr('y2', newCy);
  }

  zoomed() {
    // ignore zoom-by-brush
    if (
      !d3.event.sourceEvent ||
      (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush')
    ) return;

    const t = d3.event.transform;
    this.x.domain(t.rescaleX(this.x2).domain());

    this.focus.select('.past-graph-connection')
      .attr('d', this.line);
    this.focus.select('.past-graph-date-v-bar')
      .attr('d', this.pastDateArea);
    this.focus.selectAll('.past-graph-node')
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y));
    //Dotted line to connect nearest measurement to verticle date line
    this.focus.select('.graph-past-bar-point-line')
      .attr('x1', this.x(this.pastDateAreaPointLine.x1))
      .attr('y1', this.y(this.pastDateAreaPointLine.y1))
      .attr('x2', this.x(this.pastDateAreaPointLine.x2))
      .attr('y2', this.y(this.pastDateAreaPointLine.y2));
    
    this.focus.select('.axis--x').call(this.xAxis);
    this.svg.select('.past-graph-brush').call(
      this.brush.move, this.x.range().map(t.invertX, t)
    );
  }
}

PastGraph.propTypes = {
  data: PropTypes.instanceOf(Object),
  futureMin: PropTypes.number,
  futureMax: PropTypes.number,
  present: PropTypes.number,
  futureValue: PropTypes.number,
  futureChangeHandler: PropTypes.func,
  pastDate: PropTypes.instanceOf(Object),
  activeMeasureHandler: PropTypes.func,
  code: PropTypes.string,
  pastDateMeasurement: PropTypes.string,
  referenceRange: PropTypes.array,
  absWidth: PropTypes.number,
};

export default PastGraph;
