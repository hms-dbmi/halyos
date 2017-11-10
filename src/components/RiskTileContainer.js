import { connect } from 'react-redux';
import RiskTile from './RiskTile';

const mapStateToProps = state => {
	return {
		futureMeasurements: state.measurementState.futureMeasurements,
		presentMeasurements: state.measurementState.presentMeasurements
	}
}

const RiskTileContainer = connect(
  mapStateToProps
)(RiskTile);

export default RiskTileContainer;