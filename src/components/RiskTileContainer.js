import { connect } from 'react-redux';
import RiskTile from './RiskTile';

const mapStateToProps = state => {
	return {
		futureMeasurements: state.measurementState.futureMeasurements,
		presentMeasurements: state.measurementState.presentMeasurements,
		periodOfTime: state.measurementState.periodOfTime
	}
}

const RiskTileContainer = connect(
  mapStateToProps
)(RiskTile);

export default RiskTileContainer;