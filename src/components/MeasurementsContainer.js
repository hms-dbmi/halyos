import { connect } from 'react-redux';
import Measurements from './Measurements';
import { setTimePeriod } from '../services/MeasurementActions';

const mapStateToProps = state => ({
  periodOfTime: state.measurementState.periodOfTime,
});

const mapDispatchToProps = dispatch => ({
  setTimePeriod: time => dispatch(setTimePeriod(time)),
});

const MeasurementsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Measurements);

export default MeasurementsContainer;
