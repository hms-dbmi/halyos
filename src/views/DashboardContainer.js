import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import {
  fetchAllPatientDataIfNeeded, fetchMostRecentObsByCode
} from '../services/fhir/FhirActions';

const mapStateToProps = (state, ownProps) => ({
  //patient: state.fhirPatientData.ptData,
  patient: ownProps.patient[0].resource,
  mostRecentObs: state.fhirObservationData.mostRecentMeasurements,
  external: state.externalState
});

const mapDispatchToProps = dispatch => ({
  getPatientDemographics: patientId => dispatch(fetchAllPatientDataIfNeeded(patientId)),
  getMostRecentObsByCode: (patientID, code) => dispatch(fetchMostRecentObsByCode(patientID, code))
});

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

export default DashboardContainer;
