import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

var rootReducer = combineReducers({
  routing,
});

export default rootReducer;