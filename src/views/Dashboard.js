import React from 'react';

// Components
import FilteredList from '../components/FilteredList';
import AppointmentsTile from '../components/AppointmentsTile';
import PollenContainer from '../components/env/PollenContainer';
import AirQuality from '../components/env/AirQuality';
import Flu from '../components/env/Flu';
import RiskTile from '../components/RiskTile';

// Services
import { getPatID } from '../services/smart_setup';

// Styles
import { envTileStyle } from '../styles/Environment-style';
import './Dashboard.css';

const measurements = [
  {
    name: 'Systolic Blood Pressure',
    units: 'mmHg',
    past: '120',
    present: '110',
  },
  {
    name: 'Diastolic Blood Pressure',
    units: 'mmHg',
    past: '90',
    present: '95',
  },
  {
    name: 'Heart Rate',
    units: 'bpm',
    past: '90',
    present: '70',
  },
  {
    name: 'Respiration Rate',
    units: 'breaths/min',
    past: '18',
    present: '18',
  },
];

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.getPatientDemographics(getPatID());
  }

  render() {
    if (this.props.isFetchingAllPatientData || !this.props.patient) {
      return <div>Loading...</div>;
    }

    let lat;
    let long;

    if (this.props.patient.address[0].extension[0].url.endsWith('geolocation')) {
      if (this.props.patient.address[0].extension[0].extension[0].url === 'latitude') {
        lat = this.props.patient.address[0].extension[0].extension[0].valueDecimal;
        long = this.props.patient.address[0].extension[0].extension[1].valueDecimal;
      } else {
        long = this.props.patient.address[0].extension[0].extension[0].valueDecimal;
        lat = this.props.patient.address[0].extension[0].extension[1].valueDecimal;
      }
    } else {
      // TODO: we gotta add a function here that goes and gets it if we don't have it
      // likewise, vice versa, given lat and long, go get the location info
    }

    const ptLoc = {
      country_code: this.props.patient.address[0].country,
      region_code: this.props.patient.address[0].state,
      city: this.props.patient.address[0].city,
      zip_code: this.props.patient.address[0].postalCode,
      latitude: lat,
      longitude: long,
    };

    const patient = {
      gender: this.props.patient.gender,
      birthDate: this.props.patient.birthDate
    };

    const graphData = [{
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
    }];

    const mappedMeasures = measurements.map(measurements => (
      <tr className = 'pure-table pure-table-horizontal'>
        <td>{measurements.name} [{measurements.units}]</td>
        <td>{measurements.past}</td>
        <td>{measurements.present}</td>
        <td>{measurements.future}</td>
      </tr>
    ));

    return (
      <div className="dashboard full-dim flex-c flex-col">
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

        <div className="dashboard-bottom flex-g-1">
          <div className="pure-u-1-2">
            <FilteredList measurements={measurements}/>
          </div>
          <div className="pure-u-8-24">
            <AppointmentsTile patient={patient}/>
          </div>
          <div className="pure-u-4-24">
            <div style={envTileStyle}>
              <PollenContainer location={ptLoc} />
              <div>
                <div>
                  <div>
                    Environment
                  </div>
                  <div style={envTileStyle}>
                    <PollenContainer location={ptLoc} />
                  </div>
                  <div style={envTileStyle}>
                    <AirQuality location={ptLoc} />
                  </div>
                  <div style={envTileStyle}>
                    <Flu location={ptLoc} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
