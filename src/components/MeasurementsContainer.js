import { connect } from 'react-redux';
import Measurements from './Measurements';
import { setTimePeriod } from '../services/MeasurementActions';
import {
  addFutureMeasurement,
  addPresentMeasurement,
  addPastMeasurement,
} from '../services/MeasurementActions';

const mapStateToProps = state => ({
  periodOfTime: state.measurementState.periodOfTime,
  futureMeasurements: state.measurementState.futureMeasurements,
  presentMeasurements: state.measurementState.presentMeasurements,
});

const mapDispatchToProps = dispatch => ({
  setTimePeriod: time => dispatch(setTimePeriod(time)),
  addPresentMeasurement: (code, value) => dispatch(addPresentMeasurement(code, value)),
  addFutureMeasurement: (code, value) => dispatch(addFutureMeasurement(code, value)),
  addPastMeasurement: (code, value) => dispatch(addPastMeasurement(code, value)),
});

const MeasurementsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Measurements);

export default MeasurementsContainer;
