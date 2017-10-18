import React, { Component } from 'react';

// Components
import RiskTile from '../components/RiskTile.js';

import {ArrowDown} from '../components/logos/arrows/ArrowDown.js';

import DemographicTile from './profile/DemographicTile';
import VitalTile from './profile/VitalTile';
import {FilteredList, List} from './profile/FilteredList.js';
import MedicationTile from './profile/MedicationTile';
import EnvironmentTile from './profile/EnvironmentFactors.js';
import AppointmentsTile from './profile/AppointmentsTile';

import PollenContainer from './profile/env/PollenContainer.js'
import AirQuality from './profile/env/AirQuality.js';
import Flu from './profile/env/Flu.js';
import {envTileStyle} from './profile/Environment-style.js';
import { headerStyle, apptListStyle } from './profile/AppointmentsTile-style';

import Scale from '../components/logos/scale';
import BP from '../components/logos/bp';
import Cholesterol from '../components/logos/chol';
import Glucose from '../components/logos/glucose';

import {reynoldsScore} from '../services/RiskCalculators/reynolds.js';
import {CHADScore} from '../services/RiskCalculators/CHAD.js';
import {KFScore} from '../services/RiskCalculators/get_KFRisk.js';
import {COPDScore} from '../services/RiskCalculators/COPD.js';
import {diabetesScore} from '../services/RiskCalculators/get_diabetes.js';
import HelpRiskTile from '../services/RiskTiles/HelpRiskTile.js';
import {getPtLoc} from '../services/Environment/environmental_utils.js';

// Styles
import './Dashboard.css';

class Dashboard extends Component {
  constructor(props){
    super(props);
  }

  render() {
    //Known issue; the code can easily be changed, the icon not so much....
    const ptLoc = {"country_code":"US","region_code":"MA","city":"Pepperell","zip_code":"01463","latitude":42.669838,"longitude":-71.5961267};
    const patient = {"gender": "Male", "birthDate":'1979-02-03-12:45'};
    const measurements = [{"name": "Systolic Blood Pressure", "units": "mmHg", "past": "120", "present": "110" },
    {"name": "Diastolic Blood Pressure", "units": "mmHg", "past": "90", "present": "95" },
    {"name": "Heart Rate", "units": "bpm", "past": "90", "present": "70" },
    {"name": "Respiration Rate", "units": "breaths/min", "past": "18", "present": "18" }]
    const mappedMeasures = measurements.map((measurements) =>
      <tr className = "pure-table pure-table-horizontal">
        <td> {measurements["name"]} [{measurements["units"]}] </td>
        <td> {measurements["past"]}</td>
        <td> {measurements["present"]}</td>
        <td> :) </td>
      </tr>
    );

    return (
      <div className="dashboard">
        <ul className="dashboard-risk-scores flex-c no-list-style">
          <li className="flex-g-1">
            <RiskTile
              scoreName="Cardiac"
              score={10}
              unit="%"
              context={1}
              url="General_Cardiac"
            />
          </li>
          <li className="flex-g-1">
            <RiskTile
              scoreName="Stroke"
              score={10}
              unit="%"
              context={1}
              url="Stroke"
            />
          </li>
          <li className="flex-g-1">
            <RiskTile
              scoreName="Kidney Failure"
              score={10}
              unit="%"
              context={5}
              url="Kidney_Failure"
            />
          </li>
          <li className="flex-g-1">
            <RiskTile
              scoreName="COPD Mortality"
              score={10}
              unit="%"
              context={4}
              url="COPD_Mortality"
            />
          </li>
          <li className="flex-g-1">
            <RiskTile
              scoreName="Diabetes"
              score={10}
              unit="%"
              context={5}
              url="Diabetes"
            />
          </li>
        </ul>

        <div>
          <div className="pure-u-1-2" style={{"padding-left":"2px", "padding-right":"20px", "height":"300px", "overflow":"auto"}}>
            <FilteredList measurements={measurements}/>
          </div>
          <div className="pure-u-8-24">
            <AppointmentsTile patient={patient}/>
          </div>
          <div className="pure-u-4-24">
            <div style={{"order":"2"}}>
              <div style={envTileStyle}>
                <PollenContainer location={ptLoc} />
                <div style={{"display":"flex", "flex-direction":"row", "justify-content":"center"}}>
                  <div style={{"display":"flex", "flex-direction":"column", "justify-content": "center"}}>
                    <div style={{"textAlign":'center', "fontSize": "20", "order":"1"}}>
                      Environment
                    </div>
                    <div style={{"order":"2"}}>
                      <div style={envTileStyle}>
                        <PollenContainer location={ptLoc} />
                      </div>
                    </div>
                    <div style={{"order":"3"}}>
                      <div style={envTileStyle}>
                        <AirQuality location={ptLoc} />
                      </div>
                    </div>
                    <div style={{"order":"4"}}>
                      <div style={envTileStyle}>
                        <Flu location={ptLoc} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;
