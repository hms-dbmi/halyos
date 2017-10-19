import { connect } from 'react-redux';
import Header from './Header';
import { fetchAllPatientDataIfNeeded, fetchMostRecentEncounterData } from '../services/fhir/FhirActions';

const mapStateToProps = state => {
	return {
		patient:state.fhirPatientData.ptData,
		isFetchingAllPatientData:state.fhirPatientData.isFetchingAllPatientData,
		lastVisit:state.fhirEncounterData.lastVisit

	}
}

const mapDispatchToProps = dispatch => {
  return {
    getPatientDemographics: (patient_id) => dispatch(fetchAllPatientDataIfNeeded(patient_id)),
    getLastVisit: (patient_id) => dispatch(fetchMostRecentEncounterData(patient_id))
  };
};

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default HeaderContainer;