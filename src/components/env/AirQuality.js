import React, { Component } from 'react';
import $ from 'jquery';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import AIQ from './logos/aiq/aiq';

// Components
import Icon from '../Icon';

const AQI_LEVELS = [
  [50, 'Good', '#00FF00', 'Air quality is considered satisfactory,  and air pollution poses little or no risk.'],
  [100, 'Moderate', '#FFFF00', 'Air quality is acceptable; however,  for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.'],
  [150, 'Unhealthy for Sensitive Groups', '#FFA500', 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.'],
  [200, 'Unhealthy', '#FF0000', 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.'],
  [300, 'Very unhealthy', '#800080', 'Health alert: everyone may experience more serious health effects.'],
  [500, 'Hazardous', '#800000', 'Health warnings of emergency conditions. The entire population is more likely to be affected.'],
];

const AQI_LEVELS_ONLY = AQI_LEVELS.map(element => element[0]);

class AirQuality extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };

    $.getJSON('http://api.airvisual.com/v2/nearest_city?key=RaaZECPFvpEBgetio', (data) => {
      this.setState({ data });
    });
  }

  render() {
    if (!this.state.data) return <div>Loading...</div>;
    // const airQuality = AQI_LEVELS[AQI_LEVELS_ONLY.findIndex(
    //   element => element <= this.state.data.data.current.pollution.aqius
    // )];
    const airQuality = [0,1,2,3]; //needs to be replaced and above code needs to be fixed
    const tooltip = (
      <Tooltip id="tooltip">
      <h5>Air Quality (AQI) Near You</h5>
      <table>
         <tbody>
          <tr>
              <td><strong>Main Pollutant</strong></td>
              <td>{this.state.data.data.current.pollution.mainus}</td>
          </tr>
          <tr>
              <td><strong>Air Quality Level</strong></td>
              <td>{airQuality[1]}</td>
          </tr>
        </tbody>
      </table>
      <h6>{ airQuality[3] }</h6>
      </Tooltip>
    );

    return (
      <div className="air-quality">
        <h4>Air Quality</h4>
        <div className="flex-c">
          <div className="air-quality-level">{airQuality[1]}</div>
          <Icon id="air" />
        </div>
      </div>
    );
  }
}

export default AirQuality;
