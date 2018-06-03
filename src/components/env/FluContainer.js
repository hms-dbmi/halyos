import { connect } from 'react-redux';
import Flu from './Flu';

const mapStateToProps = state => {
  return {
    closestFluMarker:state.envFactorsData.closestFluMarker,
    isFetchingFluData:state.envFactorsData.isFetchingFluData,
    failedFetchFluData:state.envFactorsData.failureFetchFluData,
  }
}

const FluContainer = connect(
  mapStateToProps,
)(Flu);

export default FluContainer;


