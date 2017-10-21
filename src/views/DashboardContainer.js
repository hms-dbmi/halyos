import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import {
    fetchAllPatientDataIfNeeded,
    fetchAllObservations
} from '../services/fhir/FhirActions';

const mapStateToProps = state => {
	return {
		patient: state.fhirPatientData.ptData,
		isFetchingAllPatientData: state.fhirPatientData.isFetchingAllPatientData
	}
}

const mapDispatchToProps = dispatch => {
  return {
    getPatientDemographics:
      patient_id => dispatch(fetchAllPatientDataIfNeeded(patient_id))
  };
};

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

export default DashboardContainer;
