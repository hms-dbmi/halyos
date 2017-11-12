import { connect } from 'react-redux';
import Measurement from './Measurement';
import {
  addFutureMeasurement,
  addPresentMeasurement
} from '../services/MeasurementActions';

const mapStateToProps = state => ({
  futureMeasurements: state.measurementState.futureMeasurements,
  presentMeasurements: state.measurementState.presentMeasurements
});

const mapDispatchToProps = dispatch => ({
  addPresentMeasurement: (code, value) => dispatch(addPresentMeasurement(code, value)),
  addFutureMeasurement: (code, value) => dispatch(addFutureMeasurement(code, value)),
});

const MeasurementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Measurement);

export default MeasurementContainer;
