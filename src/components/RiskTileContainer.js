import { connect } from 'react-redux';
import RiskTile from './RiskTile';
const mapStateToProps = (state, ownProps) => {
	var futureScoreValue = ownProps.futureScore(state.measurementState.presentMeasurements, state.measurementState.futureMeasurements, ownProps.data.patient, ownProps.data.conditions, ownProps.data.medications)
	return {
		futureMeasurements: state.measurementState.futureMeasurements,
		presentMeasurements: state.measurementState.presentMeasurements,
		periodOfTime: state.measurementState.periodOfTime,
		futureScoreValue: futureScoreValue
	}
}

const RiskTileContainer = connect(
  mapStateToProps
)(RiskTile);

export default RiskTileContainer;