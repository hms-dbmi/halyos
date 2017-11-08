import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import defaultSetReducer from './utils/default-set-reducer';

import { fhirPatientData, fhirObservationData, fhirEncounterData } from './services/fhir/FhirReducers';
import { envFactorsData } from './components/env/EnvReducers';

import { measurementState } from './services/MeasurementReducers';

export const pastDate = defaultSetReducer('pastDate', new Date(2012, 7, 15));

const rootReducer = combineReducers({
  routing,
  fhirPatientData,
  fhirObservationData,
  envFactorsData,
  fhirEncounterData,
  measurementState,
  pastDate
});

export default rootReducer;
