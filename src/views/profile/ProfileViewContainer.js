import { connect } from 'react-redux';
import ProfileView from './Profile_View';
import { fetchAllPatientData, fetchAllObservations } from '../../services/fhir/FhirActions';

const mapStateToProps = state => {
	return {
		patient:state.fhirPatientData.ptData,
		isFetchingAllPatientData:state.fhirPatientData.isFetchingAllPatientData
	}
}

const mapDispatchToProps = dispatch => {
  return {
    getPatientDemographics: (patient_id) => dispatch(fetchAllPatientData(patient_id))
  };
};

const ProfileViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileView);

export default ProfileViewContainer;