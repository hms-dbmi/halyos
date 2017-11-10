import { connect } from 'react-redux'
import Measurement from './Measurement.js'
import { addFutureMeasurement } from '../services/MeasurementActions' 
import { addPresentMeasurement } from '../services/MeasurementActions' 


const mapStateToProps = state => {
	return {
		futureMeasurements:state.measurementState.futureMeasurements,
		presentMeasurements:state.measurementState.presentMeasurements
	}
}

const mapDispatchToProps = dispatch => {
  return {
  	addPresentMeasurement: (code, value) => dispatch(addPresentMeasurement(code,value)),
    addFutureMeasurement: (code, value) => dispatch(addFutureMeasurement(code, value)),
  };
};

const MeasurementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Measurement)

export default MeasurementContainer;
