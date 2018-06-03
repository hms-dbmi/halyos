import PropTypes from 'prop-types';
import React from 'react';

// Components
import MeasurementsContainer from '../components/MeasurementsContainer';
import MeasurementAbout from '../components/MeasurementAbout';
import PreventativeCareSuggestionsContainer from '../components/PreventativeCareSuggestionsContainer';
import EnvironmentContainer from '../components/EnvironmentContainer';
import RiskTileContainer from '../components/RiskTileContainer';
import riskText from '../texts/riskText';

// Services
import { getPatID, getInsecureURL } from '../services/smart_setup';
import { reynoldsScore, futureReynolds, reynoldsScorePast } from '../services/RiskCalculators/reynolds';
import { CHADScore, futureCHAD, CHADPastScore } from '../services/RiskCalculators/CHAD';
import { KFRScore, futureKFRRisk, pastKFRRisk } from '../services/RiskCalculators/get_KFRisk';
import { COPDScore, futureCOPD, pastCOPDScore } from '../services/RiskCalculators/COPD';
import { diabetesScore, futureDiabetes, diabetesPast } from '../services/RiskCalculators/get_diabetes';

import measuresForRisks from '../texts/measurementsForRiskScores';

import { sortMeasurements, listToDictMeasurements } from '../services/general_utils';
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
      rnd: 0,
      serverDown: false,
    };

    this.forceRerenderBound = this.forceRerender.bind(this);
  }

  /* ************************** Life Cycle Methods ************************** */

  componentDidMount() {
    // var mkFhir = require('fhir.js');
    
    // var client = mkFhir({
    //   baseUrl: getInsecureURL()
    // });

    // console.log("nextpage: ", client);

    // var testExcludeList = ['30522-7', '20565-8', "6298-4"];
    // // var queryDict = {'subject':getPatID().toString()}
    // var excludeList = [];
    // for(let code of testExcludeList) {
    //   excludeList.push(code)
    // }
    // // var queryDictPiece = {'$and': [{'subject':getPatID().toString()},{code: {'$and': ['30522-7', '20565-8', "6298-4"]}}]}
    // var queryDictPiece = {cofdde: {'$or': [JSON.stringify({'$not' :'30522-7'}), '20565-8', "6298-4"]}}

    // console.log("queryDictPiece", JSON.stringify(queryDictPiece));

    // client
    //   .fetchAll({type: 'Observation', query: {'subdject':{$not: getPatID().toString()}}})
    //   .then(function(res){
    //     var bundle = res.data;
    //     // var count = (bundle.entry && bundle.entry.length) || 0;
    //     console.log("# Patients born in 1974: ", res);
    //   })
    //   .catch(function(res){
    //     console.log("error res", res);
    //     //Error responses
    //     if (res.status){
    //         console.log('Error1', res.status);
    //     }

    //     //Errors
    //     if (res.message){
    //         console.log('Error1', res.message);
    //     }
    //   });

    this.props.getPatientDemographics(getPatID());
    this.props.getAllConditionData(getPatID());
    this.props.getAllMedReqData(getPatID());
    // let codeList = [];
    let mostRecentMeaCodeList = [];

    // first we pull the data of the measurements necessary to calculate current risk scores
    // for (const key in measuresForRisks) {
    //   if (!measuresForRisks.hasOwnProperty(key)) {
    //     continue;
    //   }
    //   let riskScore = key;
    //   let riskScoreMeasures = measuresForRisks[key];
    //   for(let measurement of riskScoreMeasures){
    //     if(Array.isArray(measurement)){
    //       if(!(mostRecentMeaCodeList.indexOf(measurement[1]) > -1)){
    //         this.props.getMostRecentObsByCode(getPatID(), measurement[0], measurement[1]);
    //         mostRecentMeaCodeList.push(measurement[1]);
    //       }
    //     }
    //     else {
    //       if(!(mostRecentMeaCodeList.indexOf(measurement) > -1)){
    //         this.props.getMostRecentObsByCode(getPatID(), measurement);
    //         mostRecentMeaCodeList.push(measurement);
    //       }
    //     }  
    //   }
    // }

    // next we pull all measurements required for the risk scores, so we can calculate previous risk scores.
    for (const key in measuresForRisks) {
      if (!measuresForRisks.hasOwnProperty(key)) {
        continue;
      }
      let riskScore = key;
      let riskScoreMeasures = measuresForRisks[key];
      for(let measurement of riskScoreMeasures){
        if(Array.isArray(measurement)){
          // if(!(codeList.indexOf(measurement[1]) > -1)){
            this.props.getAllObsByCode(getPatID(), measurement[0], measurement[1]);
            // codeList.push(measurement[1]);
          // }
        }
        else {
          // if(!(codeList.indexOf(measurement) > -1)){
            this.props.getAllObsByCode(getPatID(), measurement);
            // codeList.push(measurement);
          // }
        }
      }
    }    

    this.props.getAllObs(getPatID());

    window.addEventListener('resize', this.forceRerenderBound);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.forceRerenderBound);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.failedFetchPatientData){
      this.setState({serverDown:true});
    }

  }

  /* **************************** Custom Methods **************************** */

  forceRerender() {
    // Force re-rendering...
    this.setState({ rnd: Math.random() });
  }

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
    if (this.props.isFetchingAllPatientData) {
      return <div>Loading...</div>;
    }

    let lat;
    let long;

    var ptInfo = this.props.patient || this.props.patientLocal;

    if (ptInfo.address[0].extension[0].url.endsWith('geolocation')) {
      if (ptInfo.address[0].extension[0].extension[0].url === 'latitude') {
        lat = ptInfo.address[0].extension[0].extension[0].valueDecimal;
        long = ptInfo.address[0].extension[0].extension[1].valueDecimal;
      } else {
        long = ptInfo.address[0].extension[0].extension[0].valueDecimal;
        lat = ptInfo.address[0].extension[0].extension[1].valueDecimal;
      }
    } else {
      // TODO: we gotta add a function here that goes and gets it if we don't have it
      // likewise, vice versa, given lat and long, go get the location info
    }

    const ptLoc = {
      country_code: ptInfo.address[0].country,
      region_code: ptInfo.address[0].state,
      city: ptInfo.address[0].city,
      zip_code: ptInfo.address[0].postalCode,
      latitude: lat,
      longitude: long,
    };

    const patient = {
      gender: ptInfo.gender,
      birthDate: ptInfo.birthDate
    };

    const pcsStyle = {
      width: 'auto'
    };
    if (this.state.pcsIsCollapsed) {
      const { clientWidth } = this.pcsEl;
      pcsStyle.width = clientWidth;
    }

    const mesWidth = this.state.meaIsExpanded ? 'pure-u-16-24' : 'pure-u-12-24';
    const mesWidthRel = this.state.meaIsExpanded ? 16 / 26 : 12 / 24;
    const mesWidthAbs = this.baseEl
      ? Math.round(
        (this.baseEl.getBoundingClientRect().width * mesWidthRel) -
        (16 * (1.5 + 0.8))
      )
      : 0;

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

    let riskLiverWidth = !riskDetails
      ? 'pure-u-1-5'
      : 'pure-u-1-5 dashboard-risk-hidden';
    riskLiverWidth = this.state.riskIsExpanded === 'Liver Fibrosis'
      ? 'pure-u-16-24'
      : riskLiverWidth;

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
      ? 'pure-u-8-24'
      : 'pure-u-8-24 dashboard-risk-hidden';

    return (
      <div className="dashboard full-dim flex-c flex-col">
        <ul className="dashboard-risk-scores pure-g no-list-style">
          <li className={riskCardiacWidth}>
            { !this.state.serverDown ? 
              <RiskTileContainer
                expand={this.expandRisk.bind(this)}
                name="Cardiac"
                score={reynoldsScore(
                  null,
                  this.props.patient,
                  listToDictMeasurements(this.props.allObsByCode),
                  this.props.external.smoking[1],
                  this.props.external.heartfamhist
                )}
                futureScore={futureReynolds}
                pastScore={reynoldsScore}
                data={{
                  patient: this.props.patient,
                  observations: listToDictMeasurements(this.props.allObsByCode),
                }}
                unit="%"
                context={10}
                url="General_Cardiac"
                currRisk={this.state.riskIsExpanded}
              /> :
              <RiskTileContainer
                expand={this.expandRisk.bind(this)}
                name="Cardiac"
                score={reynoldsScore(
                  null,
                  this.props.patientLocal,
                  sortMeasurements(this.props.observationsLocal),
                  this.props.external.smoking[1],
                  this.props.external.heartfamhist
                )}
                futureScore={futureReynolds}
                pastScore={reynoldsScore}
                data={{
                  patient: this.props.patientLocal,
                  observations: sortMeasurements(this.props.observationsLocal)
                }}
                unit="%"
                context={10}
                url="General_Cardiac"
                currRisk={this.state.riskIsExpanded}
              /> 
            }
          </li>
          <li className={riskLiverWidth}>
            { !this.state.serverDown ? 
              <RiskTileContainer
                expand={this.expandRisk.bind(this)}
                name="Liver Fibrosis"
                score={CHADScore(
                  this.props.patient,
                  this.props.allConditionData,
                  listToDictMeasurements(this.props.allObsByCode)
                )}
                futureScore={futureCHAD}
                pastScore={CHADPastScore}
                data={{
                  patient: this.props.patient,
                  conditions: this.props.allConditionData,
                  observations: listToDictMeasurements(this.props.allObsByCode),
                }}
                unit="%"
                context={1}
                url="Liver_Fibrosis"
                currRisk={this.state.riskIsExpanded}
              /> :
              <RiskTileContainer
                expand={this.expandRisk.bind(this)}
                name="Liver Fibrosis"
                score={CHADScore(
                  this.props.patientLocal,
                  this.props.conditionsLocal,
                  sortMeasurements(this.props.observationsLocal),
                )}
                futureScore={futureCHAD}
                pastScore={CHADPastScore}
                data={{
                  patient: this.props.patientLocal,
                  conditions: this.props.conditionsLocal,
                  observations: sortMeasurements(this.props.observationsLocal)
                }}
                unit="%"
                context={1}
                url="Liver_Fibrosis"
                currRisk={this.state.riskIsExpanded}
              />
            }
          </li>
          <li className={riskKidneyWidth}>
            { !this.state.serverDown ? 
              <RiskTileContainer
                expand={this.expandRisk.bind(this)}
                name="Kidney Failure"
                score={KFRScore(
                  this.props.patient,
                  listToDictMeasurements(this.props.allObsByCode)
                )}
                futureScore={futureKFRRisk}
                pastScore={pastKFRRisk}
                data={{
                  patient: this.props.patient,
                  observations: this.props.observations
                }}
                unit="%"
                context={5}
                url="Kidney_Failure"
                currRisk={this.state.riskIsExpanded}
              /> :
              <RiskTileContainer
                expand={this.expandRisk.bind(this)}
                name="Kidney Failure"
                score={KFRScore(
                  this.props.patientLocal,
                  sortMeasurements(this.props.observationsLocal)
                )}
                futureScore={futureKFRRisk}
                pastScore={pastKFRRisk}
                data={{
                  patient: this.props.patientLocal,
                  observations: sortMeasurements(this.props.observationsLocal)
                }}
                unit="%"
                context={5}
                url="Kidney_Failure"
                currRisk={this.state.riskIsExpanded}           
              />
            } 
          </li>
          <li className={riskCopdWidth}>
            { !this.state.serverDown ?
              <RiskTileContainer
                expand={this.expandRisk.bind(this)}
                name="COPD Mortality"
                score={COPDScore(
                  this.props.patient,
                  listToDictMeasurements(this.props.allObsByCode),
                  this.props.conditions
                )}
                futureScore={futureCOPD}
                pastScore={pastCOPDScore}
                data={{
                  patient: this.props.patient,
                  observations:this.props.observations,
                  conditions:this.props.conditions
                }}
                unit="%"
                context={4}
                url="COPD_Mortality"
                currRisk={this.state.riskIsExpanded}
              /> :
              <RiskTileContainer
                expand={this.expandRisk.bind(this)}
                name="COPD Mortality"
                score={COPDScore(
                  this.props.patientLocal,
                  sortMeasurements(this.props.observationsLocal),
                  this.props.conditionsLocal
                )}
                futureScore={futureCOPD}
                pastScore={pastCOPDScore}
                data={{
                  patient: this.props.patientLocal,
                  observations: sortMeasurements(this.props.observationsLocal),
                  conditions:this.props.conditionsLocal
                }}
                unit="%"
                context={4}
                url="COPD_Mortality"
                currRisk={this.state.riskIsExpanded}
              />
            }
          </li>
          <li className={riskDiabetesWidth}>
            { !this.state.serverDown ?
              <RiskTileContainer
                expand={this.expandRisk.bind(this)}
                name="Diabetes"
                score={diabetesScore(
                  this.props.patient,
                  listToDictMeasurements(this.props.allObsByCode),
                  this.props.conditions,
                  this.props.medreqData
                )}
                futureScore={futureDiabetes}
                pastScore={diabetesPast}
                data={{
                  patient: this.props.patient,
                  observations:this.props.observations,
                  conditions:this.props.conditions,
                  medications:this.props.medreqData
                }}
                unit="%"
                context={5}
                url="Diabetes"
                currRisk={this.state.riskIsExpanded}
              /> :
              <RiskTileContainer
                expand={this.expandRisk.bind(this)}
                name="Diabetes"
                score={diabetesScore(
                  this.props.patientLocal,
                  sortMeasurements(this.props.observationsLocal),
                  this.props.conditionsLocal,
                  this.props.medreqLocal
                )}
                futureScore={futureDiabetes}
                pastScore={diabetesPast}
                data={{
                  patient: this.props.patientLocal,
                  observations: sortMeasurements(this.props.observationsLocal),
                  conditions:this.props.conditionsLocal,
                  medications:this.props.medreqLocal
                }}
                unit="%"
                context={5}
                url="Diabetes"
                currRisk={this.state.riskIsExpanded}
              />
            }
          </li>
          <li className={riskAboutWidth}>
            <div className="risk-score-about">
              <p className='about-risk-header'>
                <b>About {this.state.riskIsExpanded} Risk Score:</b>
              </p>
              <p>{this.state.riskIsExpanded === undefined
                ? ""
                : riskText[this.state.riskIsExpanded]['text']
              }</p>
            </div>
          </li>
        </ul>
        <div className="dashboard-bottom flex-g-1" ref={(el) => { this.baseEl = el; }}>
          <div className={`dashboard-bottom-panel pure-g full-h ${mesWidth}`}>
            <div
              className="wrapper"
              ref={(el) => { this.mesEl = el; }}
            > { !this.state.serverDown ?
                <MeasurementsContainer
                  expand={this.expandMea.bind(this)}
                  expandAbout={this.expandMeaAbout.bind(this)}
                  isCollapsed={this.state.meaIsCollapsed}
                  isExpanded={this.state.meaIsExpanded}
                  measurements={this.props.allObsByCode}
                  risk={this.state.riskIsExpanded} 
                  currMeasure={this.state.currMeasure}
                  absWidth={mesWidthAbs}
                /> :
                <MeasurementsContainer
                  expand={this.expandMea.bind(this)}
                  expandAbout={this.expandMeaAbout.bind(this)}
                  isCollapsed={this.state.meaIsCollapsed}
                  isExpanded={this.state.meaIsExpanded}
                  measurements={sortMeasurements(this.props.observationsLocal)}
                  risk={this.state.riskIsExpanded} 
                  currMeasure={this.state.currMeasure}
                  absWidth={mesWidthAbs}
                /> 
              }              
            </div>
          </div>
          <div className={`dashboard-bottom-panel full-h ${pcsWidth}`}>
            <div
              className="wrapper"
              ref={(el) => { this.pcsEl = el; }}
              style={pcsStyle}
            > {/* preventative care and env tiles have their local data backup built into the components themselves, check there. */}
              <PreventativeCareSuggestionsContainer
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
              <EnvironmentContainer
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
  allConditionData: PropTypes.array,
  getPatientDemographics: PropTypes.func,
  isFetchingAllPatientData: PropTypes.bool,
  medreqData: PropTypes.array,
  observations: PropTypes.array,
  patient: PropTypes.object,
};

export default Dashboard;
