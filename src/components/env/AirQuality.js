import PropTypes from 'prop-types';
import React from 'react';

// Components
import EnvironmentTile from '../EnvironmentTile';

const AirQuality = props => (
  <EnvironmentTile
    name="Air Quality"
    expand={props.expand}
    icon="air"
    isCollapsed={props.isCollapsed}
    isExpanded={props.isExpanded}
    level={props.airQuality}
  >
    <div>
      <h5>Air Quality (AQI) Near You</h5>
      <div>
        <h6>Main Pollutant</h6>
        <div>{props.pollutant}</div>
        <h6>Air Quality Level</h6>
        <div>{props.airQualityExplanation}</div>
      </div>
    </div>
  </EnvironmentTile>
);

AirQuality.propTypes = {
  airQuality: PropTypes.string,
  airQualityExplanation: PropTypes.string,
  expand: PropTypes.func,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  pollutant: PropTypes.string,
};

export default AirQuality;
