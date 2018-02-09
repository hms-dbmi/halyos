import PropTypes from 'prop-types';
import React from 'react';

// Components
import MeasurementsContainer from '../components/MeasurementsContainer';
import MeasurementAbout from '../components/MeasurementAbout';
import PreventativeCareSuggestions from '../components/PreventativeCareSuggestions';
import Environment from '../components/Environment';
import RiskTileContainer from '../components/RiskTileContainer';
import riskText from '../texts/riskText';

// Services
import { getPatID } from '../services/smart_setup';
import { reynoldsScore, futureReynolds, reynoldsScorePast } from '../services/RiskCalculators/reynolds';
import { CHADScore, futureCHAD, CHADPastScore } from '../services/RiskCalculators/CHAD';
import { KFRScore, futureKFRRisk, pastKFRRisk } from '../services/RiskCalculators/get_KFRisk';
import { COPDScore, futureCOPD, pastCOPDScore } from '../services/RiskCalculators/COPD';
import { diabetesScore, futureDiabetes, diabetesPast } from '../services/RiskCalculators/get_diabetes';
import { sortMeasurements } from '../services/general_utils';

// Styles
import './Dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      envIsCollapsed: false,
      envIsExpanded: false,
      meaIsCollapsed: false,
      meaIsExpanded: false,
      meaDesIsCollapsed: true,
      meaDesIsExpanded: false,
      pcsIsCollapsed: false,
      pcsIsExpanded: false,
    };
  }

  /* ************************** Life Cycle Methods ************************** */

  componentDidMount() {
    //this.props.getPatientDemographics(getPatID()); UNCOMMENT ME TO USE LIVE DATA
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
      meaIsExpanded: !collapse,
      envIsCollapsed: !collapse,
      envIsExpanded: false,
      meaDesIsCollapsed: true,
      meaDesIsExpanded: false,
      pcsIsCollapsed: !collapse,
      pcsIsExpanded: false,
    });
  }

  expandMeaAbout(collapse, measure = null) {
    if(!collapse && this.state.meaDesIsExpanded && measure != this.state.currMeasure) {
      //put away currentmeasurement
      this.expandMeaAbout(true, this.state.currMeasure)
    }
    this.setState({
      envIsCollapsed: !collapse,
      envIsExpanded: false,
      meaIsExpanded: !collapse,
      meaDesIsCollapsed: collapse,
      meaDesIsExpanded: !collapse,
      pcsIsCollapsed: !collapse,
      pcsIsExpanded: false,
      currMeasure: measure
    });
  }

  expandRisk(risk) {
    const newRisk = this.state.riskIsExpanded === risk ? undefined : risk;
    this.setState({
      envIsCollapsed: !!newRisk,
      envIsExpanded: false,
      meaIsExpanded: !!newRisk,
      meaDesIsCollapsed: !newRisk,
      meaDesIsExpanded: !!newRisk,
      pcsIsCollapsed: !!newRisk,
      pcsIsExpanded: false,
      riskIsExpanded: newRisk
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

    const mesWidth = this.state.meaIsExpanded ? 'pure-u-16-24' : 'pure-u-12-24';

    let pcsWidth = this.state.pcsIsExpanded ? 'pure-u-12-24' : 'pure-u-8-24';
    pcsWidth = this.state.pcsIsCollapsed || this.state.meaDesIsExpanded
      ? 'pure-u-8-24 dashboard-bottom-panel-hidden'
      : pcsWidth;

    let envWidth = this.state.envIsExpanded
      ? 'pure-u-12-24'
      : 'pure-u-4-24';
    envWidth = this.state.meaDesIsExpanded
      ? 'pure-u-4-24 dashboard-bottom-panel-hidden'
      : envWidth;

    let meaDesWidth = this.state.meaDesIsExpanded
      ? 'pure-u-12-24'
      : 'pure-u-12-24 dashboard-bottom-panel-hidden';
    meaDesWidth = this.state.meaDesIsExpanded && this.state.meaIsExpanded
      ? 'pure-u-8-24'
      : meaDesWidth;

    const riskDetails = typeof this.state.riskIsExpanded !== 'undefined';

    let riskCardiacWidth = !riskDetails
      ? 'pure-u-1-5'
      : 'pure-u-1-5 dashboard-risk-hidden';
    riskCardiacWidth = this.state.riskIsExpanded === 'Cardiac'
      ? 'pure-u-16-24'
      : riskCardiacWidth;

    let riskStrokeWidth = !riskDetails
      ? 'pure-u-1-5'
      : 'pure-u-1-5 dashboard-risk-hidden';
    riskStrokeWidth = this.state.riskIsExpanded === 'Stroke'
      ? 'pure-u-16-24'
      : riskStrokeWidth;

    let riskKidneyWidth = !riskDetails
      ? 'pure-u-1-5'
      : 'pure-u-1-5 dashboard-risk-hidden';
    riskKidneyWidth = this.state.riskIsExpanded === 'Kidney Failure'
      ? 'pure-u-16-24'
      : riskKidneyWidth;

    let riskCopdWidth = !riskDetails
      ? 'pure-u-1-5'
      : 'pure-u-1-5 dashboard-risk-hidden';
    riskCopdWidth = this.state.riskIsExpanded === 'COPD Mortality'
      ? 'pure-u-16-24'
      : riskCopdWidth;

    let riskDiabetesWidth = !riskDetails
      ? 'pure-u-1-5'
      : 'pure-u-1-5 dashboard-risk-hidden';
    riskDiabetesWidth = this.state.riskIsExpanded === 'Diabetes'
      ? 'pure-u-16-24'
      : riskDiabetesWidth;

    const riskAboutWidth = riskDetails
      ? 'pure-u-6-24'
      : 'pure-u-6-24 dashboard-risk-hidden';
    return (
      <div className="dashboard full-dim flex-c flex-col">
        <ul className="dashboard-risk-scores pure-g no-list-style">
          <li className={riskCardiacWidth}>
            <RiskTileContainer
              expand={this.expandRisk.bind(this)}
              name="Cardiac"
              score={reynoldsScore(
                this.props.patient,
                this.props.observations,
                this.props.external.smoking[1],
                this.props.external.heartfamhist
              )}
              futureScore={futureReynolds}
              pastScore={reynoldsScorePast}
              data={{"patient":this.props.patient, "observations":this.props.observations}}
              unit="%"
              context={10}
              url="General_Cardiac"
              currRisk={this.state.riskIsExpanded}
            />
          </li>
          <li className={riskStrokeWidth}>
            <RiskTileContainer
              expand={(args) => alert("No details available.")}
              name="Stroke"
              score={CHADScore(
                this.props.patient,
                this.props.conditions
              )}
              futureScore={futureCHAD}
              pastScore={CHADPastScore}
              data={{"patient":this.props.patient, "conditions":this.props.conditions}}
              unit="%"
              context={1}
              url="Stroke"
              currRisk={this.state.riskIsExpanded}
            />
          </li>
          <li className={riskKidneyWidth}>
            <RiskTileContainer
              expand={this.expandRisk.bind(this)}
              name="Kidney Failure"
              score={KFRScore(
                this.props.patient,
                this.props.observations
              )}
              futureScore={futureKFRRisk}
              pastScore={pastKFRRisk}
              data={{"patient":this.props.patient, "observations":this.props.observations}}
              unit="%"
              context={5}
              url="Kidney_Failure"
              currRisk={this.state.riskIsExpanded}
            />
          </li>
          <li className={riskCopdWidth}>
            <RiskTileContainer
              expand={this.expandRisk.bind(this)}
              name="COPD Mortality"
              score={COPDScore(
                this.props.patient,
                this.props.observations,
                this.props.conditions
              )}
              futureScore={futureCOPD}
              pastScore={pastCOPDScore}
              data={{"patient":this.props.patient, "observations":this.props.observations, "conditions":this.props.conditions}}
              unit="%"
              context={4}
              url="COPD_Mortality"
              currRisk={this.state.riskIsExpanded}
            />
          </li>
          <li className={riskDiabetesWidth}>
            <RiskTileContainer
              expand={this.expandRisk.bind(this)}
              name="Diabetes"
              score={diabetesScore(
                this.props.patient,
                this.props.observations,
                this.props.conditions,
                this.props.medreq
              )}
              futureScore={futureDiabetes}
              pastScore={diabetesPast}
              data={{"patient":this.props.patient, "observations":this.props.observations, "conditions":this.props.conditions, "medications":this.props.medreq}}
              unit="%"
              context={5}
              url="Diabetes"
              currRisk={this.state.riskIsExpanded}
            />
          </li>
          <li className={riskAboutWidth}>
            <p>About {this.state.riskIsExpanded}:</p>
            <p>{this.state.riskIsExpanded === undefined ? "" : riskText[this.state.riskIsExpanded]['text']}</p>
          </li>
        </ul>
        <div className="dashboard-bottom flex-g-1">
          <div className={`dashboard-bottom-panel pure-g full-h ${mesWidth}`}>
            <div
              className="wrapper"
              ref={(el) => { this.mesEl = el; }}
            >
              <MeasurementsContainer
                expand={this.expandMea.bind(this)}
                expandAbout={this.expandMeaAbout.bind(this)}
                isCollapsed={this.state.meaIsCollapsed}
                isExpanded={this.state.meaIsExpanded}
                measurements={sortMeasurements(this.props.observations)}
                risk={this.state.riskIsExpanded} />
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
                name={this.state.currMeasure}
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
