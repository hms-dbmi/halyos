import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { fhirPatientData, fhirObservationData, fhirEncounterData } from './services/fhir/FhirReducers';
import { envFactorsData } from './components/env/EnvReducers';

const rootReducer = combineReducers({
  routing,
  fhirPatientData,
  fhirObservationData,
  fhirEncounterData,
  envFactorsData,
  fhirEncounterData,
});

export default rootReducer;
