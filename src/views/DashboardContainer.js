import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import {
  fetchAllPatientDataIfNeeded
} from '../services/fhir/FhirActions';

const mapStateToProps = state => ({
  patient: state.fhirPatientData.ptData,
  isFetchingAllPatientData: state.fhirPatientData.isFetchingAllPatientData
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
