import PropTypes from 'prop-types';
import React from 'react';

// Components
import Icon from './Icon';
import PastGraph from './graphs/PastGraph';

// Styles
import './Measurement.css';

const getArrowDir = (past, present) => (past !== present
  ? 'arrow-top-right'
  : 'arrow-right'
);

const getMirrorH = (past, present) => past > present;

const GRAPH_DATA = [
  {
    x: new Date('2017-02-03'),
    y: 124
  }, {
    x: new Date('2017-02-12'),
    y: 120
  }, {
    x: new Date('2017-02-15'),
    y: 119
  }, {
    x: new Date('2017-02-23'),
    y: 132
  }, {
    x: new Date('2017-03-03'),
    y: 126
  }, {
    x: new Date('2017-03-23'),
    y: 129
  }, {
    x: new Date('2017-04-03'),
    y: 125
  }
];

const parseGraphData = (raw_data) => raw_data.map((item) => ({x: new Date(item.date), y: parseFloat(item.value)}));

class Measurement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetailsShown: false,
    };
    this.props.addPresentMeasurement(this.props.code, this.props.present);
  }

  showDetails() {
    if(this.props.past && this.props.pastDate) {
      if(this.props.risk) {
        this.props.expandAbout(false, !this.state.isDetailsShown && this.props.name)
        this.setState({
          isDetailsShown: !this.state.isDetailsShown
        });
      }
      else {
          this.setState({
            isDetailsShown: !this.state.isDetailsShown
          });
          this.props.expandAbout(this.state.isDetailsShown, this.props.name);
        }
      }
  }

  handleChange(event){
    // console.log("function", this.props.addFutureMeasurement)
    // console.log("other1", this.props.code)
    //console.log("other2", event.target.value)
    this.props.addFutureMeasurement(this.props.code, event.target.value);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.risk != this.props.risk) {
      this.setState({
        isDetailsShown: false
      })
      nextProps.risk ? nextProps.expandAbout(false) : nextProps.expandAbout(true)
    }
  }

  render() {
    // console.log("past date", this.props.userPastDate.format('MM/DD/YY'));
    var uniqueGraphID = this.props.name + "chart"
    uniqueGraphID = uniqueGraphID.replace(/\W/g,"_");
    var options = {
      "xmax": 60, "xmin": 0,
      "ymax": 40, "ymin": 0, 
      "title": "Simple Graph1",
      "xlabel": "X Axis",
      "ylabel": "Y Axis"
    }  

    function getDate(date) {
      var year = date.substring(0,4)
      var month = date.substring(5,7)
      var day = date.substring(8,10)
      return month+"/"+day+"/"+year;
    }
    var sliderValue;
    if (this.props.futureMeasurements && this.props.futureMeasurements[this.props.code]){
      sliderValue = this.props.futureMeasurements[this.props.code];
    } else if (this.props.presentMeasurements && this.props.presentMeasurements[this.props.code]) {
      sliderValue = this.props.presentMeasurements[this.props.code];
    } else {
      console.log("Failure")
      sliderValue = 0;
    }

    return (
      <div className="measurement">
        <div className="measurement-info pure-g">
          <div className="pure-u-15-24">
            <div className="full-wh flex-c flex-v-center flex-wrap">
              <p
                className="measurement-title p"
                onClick={() => this.showDetails()}
              >
                {this.props.name}
              </p>
              <div className="measurement-unit">[{this.props.unit}]</div>
            </div>
          </div>
          <div className="measurement-past pure-u-2-24 flex-c flex-v-center tooltip">
            {this.props.past || <abbr title="Not available">N/A</abbr>}
            {!this.props.past || <span className="tooltiptext">{this.props.pastDate && getDate(this.props.pastDate)}</span>}
          </div>
          <div className="measurement-past-to-future pure-u-1-24 flex-c flex-v-center">
            {this.props.past && <Icon
              id={getArrowDir(this.props.past, this.props.present)}
              mirrorH={getMirrorH(this.props.past, this.props.present)}
            />}
          </div>
          <div className="measurement-present pure-u-3-24 flex-c flex-v-center tooltip">
            {this.props.present}
            <span className="tooltiptext">{this.props.presentDate && getDate(this.props.presentDate)}</span>
          </div>
          <div className="measurement-future pure-u-3-24 flex-c flex-v-center">
            {/* {this.props.future} 
              <input type="range" orient="vertical" />
          */}
            <div className="slider-wrapper">
              <input type="range" 
                     min={this.props.present*0.5}
                     max={this.props.present*2}
                     value={sliderValue} 
                     onChange={this.handleChange.bind(this)}
              />
            </div>
          </div>
        </div>
        <div className="measurement-graph" id={uniqueGraphID}>
          {this.state.isDetailsShown && (
            <PastGraph
              pastDate={this.props.userPastDate}
              elemid={uniqueGraphID}
              options={options}
              obs_data={parseGraphData(this.props.graphData)}
              units="mmHg"
              reference_range={{ min: 110, max: 130 }}
            />
          )}
        </div>
      </div>
    );
  }
}
//              obs_data={parseGraphData(this.props.graphData)}
Measurement.propTypes = {
  expandAbout: PropTypes.func,
  name: PropTypes.string,
  unit: PropTypes.string,
  past: PropTypes.string,
  present: PropTypes.string,
  future: PropTypes.string,
};

export default Measurement;
