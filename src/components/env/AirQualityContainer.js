import { connect } from 'react-redux';
import AirQuality from './AirQuality';

const mapStateToProps = state => {
  return {
    aiq:state.envFactorsData.aiqLevels,
    isFetchingAIQData:state.envFactorsData.isFetchingAIQData,
    failedFetchingAIQData: state.envFactorsData.failureFetchAIQData,
  }
}

const AirQualityContainer = connect(
  mapStateToProps,
)(AirQuality);

export default AirQualityContainer;
