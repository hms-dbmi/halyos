import PropTypes from 'prop-types';
import React from 'react';

// Components
import EnvironmentTile from '../EnvironmentTile';

//Static Data
import {airQualityLocal} from '../../data/fhirData';

const AirQuality = props => (
  <EnvironmentTile
    name="Air Quality"
    expand={props.expand}
    icon="air"
    isCollapsed={props.isCollapsed}
    isExpanded={props.isExpanded}
    level={"Good"}
    /*level={props.airQuality}*/
  >
  {console.log(airQualityLocal.data)}
    <div>
      <h5>Air Quality (AQI) Near You</h5>
      <div>
        <h6>Main Pollutant</h6>
        <div>
          {/*{props.pollutant}*/}
          {airQualityLocal.data.current.pollution.mainus}
        </div>
        <h6>Air Quality Level</h6>
        <div>
          {/*{props.airQualityExplanation}*/}
          The air quality index is {airQualityLocal.data.current.pollution.aqius}. This means air quality is considered satisfactory, and air pollution poses little or no risk.
        </div>
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
