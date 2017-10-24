import React from 'react';

// Components
import Measurements from '../components/Measurements';
import PreventativeCareSuggestions from '../components/PreventativeCareSuggestions';
import Environment from '../components/Environment';
import RiskTile from '../components/RiskTile';

// Services
import { getPatID } from '../services/smart_setup';
import {}

// Styles
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
  constructor(props) {
    super(props);

    this.state = {
      envIsCollapsed: false,
      envIsExpanded: false,
      mesIsCollapsed: false,
      mesIsExpanded: false,
      pcsIsCollapsed: false,
      pcsIsExpanded: false,
    };
  }

  /* ************************** Life Cycle Methods ************************** */

  componentDidMount() {
    this.props.getPatientDemographics(getPatID());
  }

  /* **************************** Custom Methods **************************** */

  expandEnv(collapse) {
    this.setState({
      envIsCollapsed: collapse,
      envIsExpanded: !collapse,
      pcsIsCollapsed: !collapse,
      pcsIsExpanded: false,
    });
  }

  expandMes(collapse) {
    this.setState({
      mesIsCollapsed: collapse,
      mesIsExpanded: !collapse,
      pcsIsCollapsed: !collapse,
      pcsIsExpanded: false,
    });
  }

  /* ****************************** Rendering ******************************* */

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

    const pcsStyle = {
      width: 'auto'
    };
    if (this.state.pcsIsCollapsed) {
      const { clientWidth } = this.pcsEl;
      pcsStyle.width = clientWidth;
    }

    const mesWidth = 'pure-u-12-24';
    const pcsWidth = this.state.pcsIsExpanded
      ? 'pure-u-12-24'
      : this.state.pcsIsCollapsed
        ? 'pure-u-8-24 dashboard-bottom-panel-hidden'
        : 'pure-u-8-24';
    const envWidth = this.state.envIsExpanded
      ? 'pure-u-12-24'
      : this.state.pcsIsCollapsed
        ? 'pure-u-4-24 dashboard-bottom-panel-hidden'
        : 'pure-u-4-24';

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
          <div className={`dashboard-bottom-panel full-h ${mesWidth}`}>
            <div
              className="wrapper"
              ref={(el) => { this.mesEl = el; }}
            >
              <Measurements
                expand={this.expandMes.bind(this)}
                isCollapsed={this.state.mesIsCollapsed}
                isExpanded={this.state.mesIsExpanded}
                measurements={this.props.observations} />
            </div>
          </div>
          <div className={`dashboard-bottom-panel full-h ${pcsWidth}`}>
            <div
              className="wrapper"
              ref={(el) => { this.pcsEl = el; }}
              style={pcsStyle}
            >
              <PreventativeCareSuggestions
                birthDate={patient.birthDate}
                gender={patient.gender}
                isCollapsed={this.state.pcsIsCollapsed}
                isExpanded={this.state.pcsIsExpanded}
              />
            </div>
          </div>
          <div className={`dashboard-bottom-panel full-h ${envWidth}`}>
            <div
              className="wrapper"
              ref={(el) => { this.envEl = el; }}
            >
              <Environment
                expand={this.expandEnv.bind(this)}
                isCollapsed={this.state.envIsCollapsed}
                isExpanded={this.state.envIsExpanded}
                ptLoc={ptLoc}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
