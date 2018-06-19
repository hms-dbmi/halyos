import PropTypes from 'prop-types';
import React from 'react';

// Components
import EnvironmentTile from '../EnvironmentTile';

//Static Data
import {airQualityLocal} from '../../data/fhirData';

//styles

import './AirQuality.css';

// const pollutants = {
//   "dp2": ["ugm3", "Atmospheric Particulate Matter (2.5 micrometers)", "Fine particles that can bypass the nose and throat and penetrate deep into the lungs and some may even enter the circulatory system."], //pm2.5
//   "p1": ["ugm3", "Atmospheric Particulate Matter (10 micrometers)", ""], //pm10
//   "o3": ["ppb", "Ozone"], //Ozone O3
//   "n2": ["ppb", "Nitrogen Dioxide"], //Nitrogen dioxide NO2 
//   "s2": ["ppb", "Sulfur Dioxide"], //Sulfur dioxide SO2 
//   "co": ["ppm", "Carbon Monoxide"] //Carbon monoxide CO 
// }

const AQI_LEVELS = [
  [50, 'Good', '#00FF00', 'Air quality is satisfactory and poses little or no health risk. Ventilating your home is recommended.'],
  [100, 'Moderate', '#FFFF00', 'Air quality is acceptable and poses little health risk. Sensitive groups may experience mild adverse effects and should limit prolonged outdoor exposure.'],
  [150, 'Unhealthy for Sensitive Groups', '#FFA500', 'Air quality poses increased likelihood of respiratory symptoms in sensitive individuals while the general public might only feel slight irritation. Both groups should reduce their outdoor activity. '],
  [200, 'Unhealthy', '#FF0000', 'Air quality is deemed unhealthy and may cause increased aggravation of the heart and lungs. Sensitive groups are at high risk to experience adverse health effects of air pollution.'],
  [300, 'Very Unhealthy', '#800080', 'Air quality is deemed unhealthy and may cause increased aggravation of the heart and lungs. Sensitive groups are at high risk to experience adverse health effects of air pollution. '],
  [500, 'Hazardous', '#800000', 'Air quality is deemed toxic and poses serious risk to the heart and lungs. Everyone should avoid all outdoor exertion.'],
];

class AirQuality extends React.Component {
  render(){
    var aiqData;
    var currentAIQLevel = [0, "...", "...", "Loading..."];
    if (this.props.failedFetchingAIQData || this.props.aiq == null){
      aiqData = airQualityLocal.data;
    }
    else if (this.props.aiq){
      aiqData = this.props.aiq;
    } else {
      aiqData = airQualityLocal.data;
    }
    for (let level of AQI_LEVELS){
      if(aiqData.current.pollution.aqius > 300){
        currentAIQLevel = AQI_LEVELS[AQI_LEVELS.length - 1];
        break;
      }
      if (aiqData.current.pollution.aqius < parseInt(level[0])) {
        currentAIQLevel = level;
        break;
      }
    }
    return (
      <EnvironmentTile
        name="Air Quality"
        expand={this.props.expand}
        icon="air"
        isCollapsed={this.props.isCollapsed}
        isExpanded={this.props.isExpanded}
        level={currentAIQLevel[1]}
      >
        <div className="tile-container">
          <h5 className="env-tile-heading">Air Quality (AQI) Near You</h5>
          <div>
            {aiqData ? (
              <p><b>Main Pollutant:</b> {aiqData.current.pollution.mainus}</p>
            ) : "..." }
            {aiqData ? (
              <p><b>Air Quality Level:</b> {aiqData.current.pollution.aqius} {'\u03BC'}g/m3.</p>
            ) : "..." }
            {aiqData ? (
              <p className="desc-text">{currentAIQLevel[3]}</p>
            ) : "..." }
          </div>
        </div>
      </EnvironmentTile>
    );
  }
}


AirQuality.propTypes = {
  airQuality: PropTypes.string,
  airQualityExplanation: PropTypes.string,
  expand: PropTypes.func,
  isCollapsed: PropTypes.bool,
  isExpanded: PropTypes.bool,
  pollutant: PropTypes.string,
};

export default AirQuality;
