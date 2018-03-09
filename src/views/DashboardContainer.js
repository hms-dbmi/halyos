import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import {
  fetchAllPatientDataIfNeeded, fetchMostRecentObsByCode, fetchAllObsByCode
} from '../services/fhir/FhirActions';

const mapStateToProps = (state, ownProps) => ({
  //patient: state.fhirPatientData.ptData,
  patient: ownProps.patient[0].resource,
  mostRecentObs: state.fhirObservationData.mostRecentMeasurements,
  allObs: state.fhirObservationData.allMeasurements,
  external: state.externalState
});

const mapDispatchToProps = dispatch => ({
  getPatientDemographics: patientId => dispatch(fetchAllPatientDataIfNeeded(patientId)),
  getMostRecentObsByCode: (patientID, code, subcode = null) => dispatch(fetchMostRecentObsByCode(patientID, code, subcode)),
  getAllObsByCode: (patientID, code, subcode = null) => dispatch(fetchAllObsByCode(patientID, code, subcode))
});

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

export default DashboardContainer;
