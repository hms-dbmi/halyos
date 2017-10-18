import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { fhirPatientData, fhirObservationData } from './services/fhir/FhirReducers'
import { envFactorsData } from './components/env/EnvReducers'

var rootReducer = combineReducers({
  routing, fhirPatientData, fhirObservationData, envFactorsData
});

export default rootReducer;