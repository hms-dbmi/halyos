import { connect } from 'react-redux';
import PreventativeCareSuggestions from './PreventativeCareSuggestions';

import { fetchPreventativeCareSuggestions } from '../services/PreventativeCareActions';

const mapStateToProps = (state, ownProps) => ({
  prevCareSuggestions:state.preventativeCare.suggestions,
  isFetchingPrevCareData:state.preventativeCare.isFetchingPrevCareData,
  failedFetchingPrevCareData:state.preventativeCare.failedFetchingPrevCareData
});

const mapDispatchToProps = dispatch => ({
  getPreventativeCareSuggestions: (birthDate, gender) => dispatch(fetchPreventativeCareSuggestions(birthDate, gender)),

});

const PreventativeCareSuggestionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PreventativeCareSuggestions);

export default PreventativeCareSuggestionsContainer;
