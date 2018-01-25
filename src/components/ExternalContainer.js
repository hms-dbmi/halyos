import { connect } from 'react-redux';
import External from './External';
import {
	updateSmoking,
	updateHeartfamhist
} from '../services/ExternalActions'

const mapStateToProps = (state, ownProps) => ({
  	smoking: state.externalState.smoking,
  	heartfamhist: state.externalState.heartfamhist
});

const mapDispatchToProps = dispatch => ({
  	updateSmoking: (value) => dispatch(updateSmoking(value)),
  	updateHeartfamhist: (value) => dispatch(updateHeartfamhist(value))
});

const ExternalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(External);

export default ExternalContainer;
