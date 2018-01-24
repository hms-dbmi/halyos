import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import {
  fetchAllPatientDataIfNeeded
} from '../services/fhir/FhirActions';

const mapStateToProps = (state, ownProps) => ({
  //patient: state.fhirPatientData.ptData,
  patient: ownProps.patient[0].resource,
  isFetchingAllPatientData: state.fhirPatientData.isFetchingAllPatientData,
  external: state.externalState
});

const mapDispatchToProps = dispatch => ({
  getPatientDemographics:
    patientId => dispatch(fetchAllPatientDataIfNeeded(patientId))
});

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

export default DashboardContainer;
