import { connect } from 'react-redux';
import RiskTile from './RiskTile';

const mapStateToProps = (state, ownProps) => ({
  futureMeasurements: state.measurementState.futureMeasurements,
  presentMeasurements: state.measurementState.presentMeasurements,
  periodOfTime: state.measurementState.periodOfTime,
  futureScore: ownProps.futureScore(
    state.measurementState.presentMeasurements,
    state.measurementState.futureMeasurements,
    ownProps.data.patient,
    ownProps.data.conditions,
    ownProps.data.medications,
    ownProps.data.observations
  ),
  pastDate: state.pastDate,
  pastScore: ownProps.pastScore(
    state.pastDate,
    ownProps.data.patient,
    ownProps.data.observations
    )
});

const RiskTileContainer = connect(
  mapStateToProps
)(RiskTile);

export default RiskTileContainer;
