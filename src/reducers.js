import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { fhirPatientData } from './services/fhir/FhirReducers'
var rootReducer = combineReducers({
  routing, fhirPatientData
});

export default rootReducer;