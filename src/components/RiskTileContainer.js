import { connect } from 'react-redux';
import RiskTile from './RiskTile';

//Measurements for Risk Tile
import measuresForRisk from '../texts/measurementsForRiskScores';

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
    ownProps.data.observations,
    ownProps.data.conditions
    ),
  activeMeasure: measuresForRisk[ownProps.name].includes(state.measurementState.activeMeasure)
});

const RiskTileContainer = connect(
  mapStateToProps
)(RiskTile);

export default RiskTileContainer;
