import PropTypes from 'prop-types';
import React from 'react';

// Components
import Icon from './Icon';
import PastGraph from './Graphs/Past-Graph';

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

class Measurement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDetailsShown: false
    };
  }

  showDetails() {
    this.setState({
      isDetailsShown: !this.state.isDetailsShown
    });
    this.props.expandAbout(this.state.isDetailsShown);
  }

  render() {

    function getDate(date) {
      console.log(date);
      var year = date.substring(0,4)
      var month = date.substring(5,7)
      var day = date.substring(8,10)
      return month+"/"+day+"/"+year;
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
            {this.props.future}
          </div>
        </div>
        <div className="measurement-graph">
          {this.state.isDetailsShown && (
            <PastGraph
              obs_data={GRAPH_DATA}
              units="mmHg"
              reference_range={{ min: 110, max: 130 }}
              mainWidth={500}
              mainHeight={200}
              viewWidth={500}
              viewHeight={50}
            />
          )}
        </div>
      </div>
    );
  }
}

Measurement.propTypes = {
  expandAbout: PropTypes.func,
  name: PropTypes.string,
  unit: PropTypes.string,
  past: PropTypes.string,
  present: PropTypes.string,
  future: PropTypes.string,
};

export default Measurement;
