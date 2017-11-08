import { connect } from 'react-redux'
import Measurement from './Measurement.js'
import { addFutureMeasurement } from '../services/MeasurementActions' 

const mapStateToProps = state => {
	return {
		futureMeasurements:state.measurementState.futureMeasurements
	}
}

const mapDispatchToProps = dispatch => {
  return {
    addFutureMeasurement: (code, value) => dispatch(addFutureMeasurement(code, value)),
  };
};

const MeasurementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Measurement)

export default MeasurementContainer;
