import PropTypes from 'prop-types';
import React from 'react';

// Components
import EnvironmentTile from '../EnvironmentTile';

//Static Data
import {airQualityLocal} from '../../data/fhirData';

// const pollutants = {
//   "dp2": ["ugm3", "Atmospheric Particulate Matter (2.5 micrometers)", "Fine particles that can bypass the nose and throat and penetrate deep into the lungs and some may even enter the circulatory system."], //pm2.5
//   "p1": ["ugm3", "Atmospheric Particulate Matter (10 micrometers)", ""], //pm10
//   "o3": ["ppb", "Ozone"], //Ozone O3
//   "n2": ["ppb", "Nitrogen Dioxide"], //Nitrogen dioxide NO2 
//   "s2": ["ppb", "Sulfur Dioxide"], //Sulfur dioxide SO2 
//   "co": ["ppm", "Carbon Monoxide"] //Carbon monoxide CO 
// }

const AQI_LEVELS = [
  [50, 'Good', '#00FF00', 'Air quality is considered satisfactory,  and air pollution poses little or no risk.'],
  [100, 'Moderate', '#FFFF00', 'Air quality is acceptable; however,  for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.'],
  [150, 'Unhealthy for Sensitive Groups', '#FFA500', 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.'],
  [200, 'Unhealthy', '#FF0000', 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.'],
  [300, 'Very unhealthy', '#800080', 'Health alert: everyone may experience more serious health effects.'],
  [500, 'Hazardous', '#800000', 'Health warnings of emergency conditions. The entire population is more likely to be affected.'],
];

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
    <div>
      <h5>Air Quality (AQI) Near You</h5>
      <div>
        Main Pollutant: {airQualityLocal.data.current.pollution.mainus}
        <br/> <br/>
        Air Quality Level: <br/>
          {/*{props.airQualityExplanation}*/}
          The air quality index is {airQualityLocal.data.current.pollution.aqius}. This means air quality is considered satisfactory, and air pollution poses little or no risk.
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
