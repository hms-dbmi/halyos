import { connect } from 'react-redux';
import PollenLevel from './PollenLevel';
import { fetchPollenLevels } from './EnvActions';

const mapStateToProps = state => {
	return {
		pollen:state.envFactorsData.pollenLevels,
		isFetchingPollenData:state.envFactorsData.isFetchingPollenData
	}
}

const PollenContainer = connect(
  mapStateToProps,
)(PollenLevel);

export default PollenContainer;
