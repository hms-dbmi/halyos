import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import defaultSetReducer from './utils/default-set-reducer';

import { fhirPatientData, fhirObservationData, fhirEncounterData } from './services/fhir/FhirReducers';
import { envFactorsData } from './components/env/EnvReducers';

import { measurementState } from './services/MeasurementReducers';

import {externalState} from './services/ExternalReducers'

import {SET_PAST_DATE} from './actions'

export const pastDate = defaultSetReducer('pastDate', new Date(2012, 7, 15));

export function setPastDate(state = {}, action) {
	switch(action.type) {
		case SET_PAST_DATE:
			return Object.assign({}, state, {payload: action.pastDate})
		default:
			return state;
	}
}

const rootReducer = combineReducers({
  routing,
  fhirPatientData,
  fhirObservationData,
  envFactorsData,
  fhirEncounterData,
  measurementState,
  pastDate,
  externalState
});

export default rootReducer;
