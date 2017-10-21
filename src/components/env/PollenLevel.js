import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Pollen1 from './logos/pollen/Pollen1';
import Pollen2 from './logos/pollen/Pollen2';
import Pollen3 from './logos/pollen/Pollen3';

import { fetchPollenLevels } from './EnvActions';

// Components
import Icon from '../Icon';

const categories = {
  1: 'Low',
  2: 'High',
  3: 'Good',
  4: 'Moderate',
  5: 'Unhealthy',
  6: 'Hazardous'
};

class PollenLevel extends Component {
  componentDidMount(){
    this.props.getPollenLevels('60564');
  }

  render() {
    let avgLevel;

    if (!this.props.isFetchingPollenData && this.props.pollen) {
      let allergyMeasures = this.props.pollen.DailyForecasts[0].AirAndPollen.filter(function(item){
        return (item.Name !== "UVIndex" && item.Name !== "AirQuality");
      });

      let counter = 0;
      let avgLevel;
      allergyMeasures.map(function(item) {
        counter += item.CategoryValue;
      });

      avgLevel = Math.round(counter/Object.keys(allergyMeasures).length);

      const listItems = allergyMeasures.map((item) =>
        <tr>
          <td>{item.Name}</td>
          <td>{item.Category}</td>
        </tr>
      );

      const tooltip = (
        <Tooltip id="tooltip">
        <h5>Pollen Levels</h5>
        <table>
          <thead>
            <tr>
                <th>Type</th>
                <th>Level</th>
             </tr>
           </thead>
           <tbody>
           {listItems}
          </tbody>
        </table>
        </Tooltip>
      );

      let pollenIcon;
      if(avgLevel >= 1 && avgLevel <= 2) {
        pollenIcon = <Pollen1 placement="top" tooltip={tooltip} level={avgLevel}/>
      }
      else if (avgLevel >=3 && avgLevel <= 4){
        pollenIcon = <Pollen2 placement="top" tooltip={tooltip} level={avgLevel}/>
      } else {
        pollenIcon = <Pollen3 placement="top" tooltip={tooltip} level={avgLevel}/>
      }
    }

    return (
      <div className="pollen">
        <h4>Pollen</h4>
        <div className="flex-c">
          <div className="pollen-level">{avgLevel || '…'}</div>
          <Icon id="pollen" />
        </div>
      </div>
    );
  }
}

export default PollenLevel;
