import { connect } from 'react-redux';
import Measurement from './Measurement';
import {
  addFutureMeasurement,
  addPresentMeasurement,
  addPastMeasurement,
  activeMeasure
} from '../services/MeasurementActions';
import {
  fetchMostRecentObsByCode,
} from '../services/fhir/FhirActions';

import {getNearestFlat} from '../services/general_utils';

const mapStateToProps = (state, ownProps) => ({
  futureMeasurements: state.measurementState.futureMeasurements,
  presentMeasurements: state.measurementState.presentMeasurements,
  pastMeasurementsValue: getNearestFlat(ownProps.graphData, state.pastDate).value,
  pastMeasurementsDate: getNearestFlat(ownProps.graphData, state.pastDate).date,
  mostRecentMeasurements: state.fhirObservationData.mostRecentMeasurements,
});

const mapDispatchToProps = dispatch => ({
  addPresentMeasurement: (code, value) => dispatch(addPresentMeasurement(code, value)),
  addFutureMeasurement: (code, value) => dispatch(addFutureMeasurement(code, value)),
  addPastMeasurement: (code, value) => dispatch(addPastMeasurement(code, value)),
  activeMeasure: (code) => dispatch(activeMeasure(code)),
  fetchMostRecentObsByCode: (patientID, code) => dispatch(fetchMostRecentObsByCode(patientID, code))
});

const MeasurementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Measurement);

export default MeasurementContainer;
