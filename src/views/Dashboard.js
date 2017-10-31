import PropTypes from 'prop-types';
import React from 'react';

// Components
import Measurements from '../components/Measurements';
import MeasurementAbout from '../components/MeasurementAbout';
import PreventativeCareSuggestions from '../components/PreventativeCareSuggestions';
import Environment from '../components/Environment';
import RiskTile from '../components/RiskTile';

// Services
import { getPatID } from '../services/smart_setup';
import { reynoldsScore } from '../services/RiskCalculators/reynolds';
import { CHADScore } from '../services/RiskCalculators/CHAD';
import { KFRScore } from '../services/RiskCalculators/get_KFRisk';
import { COPDScore } from '../services/RiskCalculators/COPD';
import { diabetesScore } from '../services/RiskCalculators/get_diabetes';
import { sortMeasurements } from '../services/general_utils';

// Styles
import './Dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      envIsCollapsed: false,
      envIsExpanded: false,
      mesIsCollapsed: false,
      mesIsExpanded: false,
      meaDesIsCollapsed: true,
      meaDesIsExpanded: false,
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
      meaDesIsCollapsed: true,
      meaDesIsExpanded: false,
      pcsIsCollapsed: !collapse,
      pcsIsExpanded: false,
    });
  }

  expandMea(collapse) {
    this.setState({
      mesIsExpanded: !collapse,
      envIsCollapsed: !collapse,
      envIsExpanded: false,
      meaDesIsCollapsed: true,
      meaDesIsExpanded: false,
      pcsIsCollapsed: !collapse,
      pcsIsExpanded: false,
    });
  }

  expandMeaAbout(collapse) {
    this.setState({
      envIsCollapsed: !collapse,
      envIsExpanded: false,
      mesIsExpanded: !collapse,
      meaDesIsCollapsed: collapse,
      meaDesIsExpanded: !collapse,
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

    let pcsWidth = this.state.pcsIsExpanded ? 'pure-u-12-24' : 'pure-u-8-24';
    pcsWidth = this.state.pcsIsCollapsed || this.state.meaDesIsExpanded
      ? 'pure-u-8-24 dashboard-bottom-panel-hidden'
      : pcsWidth;

    let envWidth = this.state.envIsExpanded
      ? 'pure-u-12-24'
      : 'pure-u-4-24';
    envWidth = this.state.pcsIsCollapsed || this.state.meaDesIsExpanded
      ? 'pure-u-4-24 dashboard-bottom-panel-hidden'
      : envWidth;

    const meaDesWidth = this.state.meaDesIsExpanded
      ? 'pure-u-12-24'
      : 'pure-u-12-24 dashboard-bottom-panel-hidden';

    return (
      <div className="dashboard full-dim flex-c flex-col">
        <ul className="dashboard-risk-scores flex-c no-list-style">
          <li className="flex-g-1">
            <RiskTile
              scoreName="Cardiac"
              score={reynoldsScore(
                this.props.patient,
                this.props.observations
              )}
              unit="%"
              context={1}
              url="General_Cardiac"
            />
          </li>
          <li className="flex-g-1">
            <RiskTile
              scoreName="Stroke"
              score={CHADScore(
                this.props.patient,
                this.props.conditions
              )}
              unit="%"
              context={1}
              url="Stroke"
            />
          </li>
          <li className="flex-g-1">
            <RiskTile
              scoreName="Kidney Failure"
              score={KFRScore(
                this.props.patient,
                this.props.observations
              )}
              unit="%"
              context={5}
              url="Kidney_Failure"
            />
          </li>
          <li className="flex-g-1">
            <RiskTile
              scoreName="COPD Mortality"
              score={COPDScore(
                this.props.patient,
                this.props.observations,
                this.props.conditions
              )}
              unit="%"
              context={4}
              url="COPD_Mortality"
            />
          </li>
          <li className="flex-g-1">
            <RiskTile
              scoreName="Diabetes"
              score={diabetesScore(
                this.props.patient,
                this.props.observations,
                this.props.conditions,
                this.props.medreq
              )}
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
                expand={this.expandMea.bind(this)}
                expandAbout={this.expandMeaAbout.bind(this)}
                isCollapsed={this.state.mesIsCollapsed}
                isExpanded={this.state.mesIsExpanded}
                measurements={sortMeasurements(this.props.observations)} />
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
          <div className={`dashboard-bottom-panel full-h ${meaDesWidth}`}>
            <div
              className="wrapper"
              ref={(el) => { this.envEl = el; }}
            >
              <MeasurementAbout
                expand={this.expandMeaAbout.bind(this)}
                isCollapsed={this.state.meaDesIsCollapsed}
                isExpanded={this.state.meaDesIsExpanded}
                name='Measurement'
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  conditions: PropTypes.array,
  getPatientDemographics: PropTypes.func,
  isFetchingAllPatientData: PropTypes.bool,
  medreq: PropTypes.array,
  observations: PropTypes.array,
  patient: PropTypes.object,
};

export default Dashboard;
