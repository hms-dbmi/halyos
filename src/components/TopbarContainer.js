import { connect } from 'react-redux';
import Topbar from './Topbar'
import { fetchAllPatientDataIfNeeded, fetchMostRecentVisitDate } from '../services/fhir/FhirActions';


const mapStateToProps = (state, ownProps) => ({
  patient: state.fhirPatientData.ptData,
  mostRecentObs: state.fhirObservationData.mostRecentMeasurements,
  mostRecentVisit: state.fhirPatientData.lastVisit,
});

const mapDispatchToProps = dispatch => ({
  getPatientDemographics: patientID => dispatch(fetchAllPatientDataIfNeeded(patientID)),
  getMostRecentVisit: patientID => dispatch(fetchMostRecentVisitDate(patientID)),
});

const TopbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Topbar);

export default TopbarContainer;
