import { connect } from 'react-redux';
import RiskTile from './RiskTile';

//Measurements for Risk Tile
import measuresForRisk from '../texts/measurementsForRiskScores';
import deepContains from '../utils/deep-contains';

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
    ownProps.data.observations,
    state.externalState.smoking[2],
    state.externalState.heartfamhist
  ),
  pastDate: state.pastDate,
  pastScore: ownProps.pastScore(
    state.pastDate,
    ownProps.data.patient,
    ownProps.data.observations,
    ownProps.data.conditions,
    null,
    state.externalState.smoking[0],
    state.externalState.heartfamhist
    ),
  activeMeasure: deepContains(measuresForRisk[ownProps.name],state.measurementState.activeMeasure),
});

const RiskTileContainer = connect(
  mapStateToProps
)(RiskTile);

export default RiskTileContainer;
