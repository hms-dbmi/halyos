import { connect } from 'react-redux';
import External from './External';
import {
	updateSmoking
} from '../services/ExternalActions'

const mapStateToProps = (state, ownProps) => ({
  	smoking: state.externalState.smoking
});

const mapDispatchToProps = dispatch => ({
  	updateSmoking: (value) => dispatch(updateSmoking(value))
});

const ExternalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(External);

export default ExternalContainer;
