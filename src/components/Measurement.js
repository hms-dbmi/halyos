import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

// Components
import Button from './Button';
import Icon from './Icon';
import PastGraph from './PastGraph';

// Styles
import './Measurement.css';

//Reference Ranges
import refRanges from '../texts/referenceRanges.js';

const getArrowDir = (past, present) => (past !== present
  ? 'arrow-top-right'
  : 'arrow-right'
);

const getMirrorH = (past, present) => past > present;

const parseGraphData = data => data.map(
  item => ({
    x: new Date(item.date),
    y: parseFloat(item.value)
  })
);

class Measurement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetailsShown: false,
    };
    this.props.addPresentMeasurement(this.props.code, this.props.present);
    if (
      !this.props.futureMeasurements ||
      !this.props.futureMeasurements[this.props.code]
    ) {
      this.props.addFutureMeasurement(this.props.code, this.props.present);
    }
  }

  showDetails() {
    if (this.props.past && this.props.pastDate) {
      if (this.props.risk) {
        this.props.expandAbout(false, !this.state.isDetailsShown && this.props.name)
        this.setState({
          isDetailsShown: !this.state.isDetailsShown
        });
      } else {
        this.setState({
          isDetailsShown: !this.state.isDetailsShown
        });
        this.props.expandAbout(this.state.isDetailsShown, this.props.name);
      }
    }
    else {
      alert("Details cannot be displayed, as the patient only has one measurement.")
    }
  }

  futureChangeHandler(newValue) {
    this.props.addFutureMeasurement(this.props.code, newValue);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.risk !== this.props.risk) {
      this.setState({
        isDetailsShown: false
      });

      if (nextProps.risk) {
        nextProps.expandAbout(false);
      } else {
        nextProps.expandAbout(true);
      }
    }
  }

  render() {
    let sliderValue;

    if (
      this.props.futureMeasurements &&
      this.props.futureMeasurements[this.props.code]
    ) {
      sliderValue = this.props.futureMeasurements[this.props.code];
    } else if (
      this.props.presentMeasurements &&
      this.props.presentMeasurements[this.props.code]
    ) {
      sliderValue = this.props.presentMeasurements[this.props.code];
    } else {
      console.warn('Couldn\'t set slider value. Force it to be zero.');
      sliderValue = 0;
    }

    const futureScore = this.props.futureMeasurements &&
      parseFloat(this.props.futureMeasurements[this.props.code]).toPrecision(3);

    const pastValue = parseFloat(this.props.pastMeasurementsValue).toFixed(2);
    const pastDate = moment(this.props.pastMeasurementsDate).format('MMM Do YYYY');

    const presentDate = this.props.presentDate &&
      moment(this.props.presentDate).format('MMM Do YYYY');

    return (
      <div className="measurement">
        <div className="measurement-info pure-g">
          <div className="pure-u-15-24">
            <div className="full-wh flex-c flex-v-center flex-wrap">
              <Button
                icon="help"
                iconOnly={true}
                className="measurement-future-help"
                onClick={this.showDetails.bind(this)}
              />
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
            {pastValue ||
              <abbr title="Not available">N/A</abbr>
            }
            {pastValue &&
              <span className="tooltiptext">{pastDate || 'N/A'}</span>
            }
          </div>
          <div className="measurement-past-to-future pure-u-1-24 flex-c flex-v-center">
            {this.props.past &&
              <Icon
                id={getArrowDir(pastValue, this.props.present)}
                mirrorH={getMirrorH(pastValue, this.props.present)}
              />
            }
          </div>
          <div className="measurement-present pure-u-3-24 flex-c flex-v-center tooltip">
            {this.props.present}
            <span className="tooltiptext">{presentDate || 'N/A'}</span>
          </div>
          <div className="measurement-future pure-u-3-24 flex-c flex-v-center">
            {futureScore}
          </div>
        </div>
        <div className="measurement-graph">
          {this.state.isDetailsShown && this.props.isExpanded && (
            <PastGraph
              pastDate={this.props.userPastDate}
              pastDateMeasurement={this.props.pastMeasurementsDate}
              data={parseGraphData(this.props.graphData)}
              units="mmHg"
              referenceRange={refRanges[this.props.code] && [refRanges[this.props.code].min, refRanges[this.props.code].max]}
              present={this.props.present}
              futureMin={this.props.present / 2}
              futureMax={this.props.present * 2}
              futureValue={sliderValue}
              futureChangeHandler={this.futureChangeHandler.bind(this)}
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
  code: PropTypes.string,
  risk: PropTypes.string,
  pastDate: PropTypes.string,
  presentDate: PropTypes.string,
  presentMeasurements: PropTypes.instanceOf(Object),
  futureMeasurements: PropTypes.instanceOf(Object),
  graphData: PropTypes.array,
  userPastDate: PropTypes.instanceOf(moment),
  addPresentMeasurement: PropTypes.func,
  addFutureMeasurement: PropTypes.func,
};

export default Measurement;
