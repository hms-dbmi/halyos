import { connect } from 'react-redux';
import AirQuality from './AirQuality';

const mapStateToProps = state => {
  return {
    aiq:state.envFactorsData.aiqLevels,
    isFetchingAIQData:state.envFactorsData.isFetchingAIQData
  }
}

const AirQualityContainer = connect(
  mapStateToProps,
)(AirQuality);

export default AirQualityContainer;
