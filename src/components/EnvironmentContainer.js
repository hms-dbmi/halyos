import { connect } from 'react-redux';
import Environment from './Environment';
import { fetchPollenLevels, fetchFluLevels, fetchAirQualityLevels } from '../services/Environment/EnvActions'


const mapStateToProps = state => {
}

const mapDispatchToProps = dispatch => {
  return {
    getPollenLevels: (lat,long) => dispatch(fetchPollenLevels(lat,long)),
    getAIQLevels: (lat,long) => dispatch(fetchAirQualityLevels(lat,long)),
    getFluLevels: (lat,long) => dispatch(fetchFluLevels(lat,long))
  };
};

const EnvironmentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Environment);

export default EnvironmentContainer;


