import { connect } from 'react-redux';
import PollenLevel from './PollenLevel';
import { fetchPollenLevels } from './EnvActions';

const mapStateToProps = state => {
	return {
		pollen:state.envFactorsData.pollenLevels,
		isFetchingPollenData:state.envFactorsData.isFetchingPollenData
	}
}

const mapDispatchToProps = dispatch => {
  return {
    getPollenLevels: (zip_code) => dispatch(fetchPollenLevels(zip_code))
  };
};

const PollenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollenLevel);

export default PollenContainer;
