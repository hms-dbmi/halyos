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
  }

  render() {
    return (
      <div className="measurement">
        <div className="measurement-info pure-g">
          <div className="pure-u-15-24">
            <div className="full-wh flex-c flex-v-center">
              <div
                className="measurement-title p"
                onClick={() => this.showDetails()}
              >
                {this.props.name}
              </div>
              <div className="measurement-unit">[{this.props.unit}]</div>
            </div>
          </div>
          <div className="measurement-past pure-u-2-24 flex-c flex-v-center">
            {this.props.past || "N/A"}
          </div>
          <div className="measurement-past-to-future pure-u-1-24 flex-c flex-v-center">
            <Icon
              id={getArrowDir(this.props.past, this.props.present)}
              mirrorH={getMirrorH(this.props.past, this.props.present)}
            />
          </div>
          <div className="measurement-present pure-u-3-24 flex-c flex-v-center">
            {this.props.present}
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
  name: PropTypes.string,
  unit: PropTypes.string,
  past: PropTypes.string,
  present: PropTypes.string,
  future: PropTypes.string,
};

export default Measurement;
