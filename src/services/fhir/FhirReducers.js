import { FETCH_ALL_OBSERVATION_REQUEST, FETCH_ALL_OBSERVATION_SUCCESS} from './FhirActions'
import { FETCH_PATIENT_REQUEST, FETCH_PATIENT_SUCCESS, FETCH_PATIENT_FAILURE } from './FhirActions'
import { FETCH_RECENT_ENCOUNTER_REQUEST, FETCH_RECENT_ENCOUNTER_SUCCESS, FETCH_RECENT_ENCOUNTER_FAILURE } from './FhirActions'
import { FETCH_RECENT_OBSERVATION_REQUEST, FETCH_RECENT_OBSERVATION_SUCCESS } from './FhirActions'
import { FETCH_ALL_OBSERVATION_BY_CODE_REQUEST, FETCH_ALL_OBSERVATION_BY_CODE_SUCCESS } from './FhirActions';

const initialFhirState = {
  "allMeasurements" : [],
  "codeList" : []
};
export function fhirObservationData(state = initialFhirState, action){
	switch (action.type){
    case FETCH_RECENT_OBSERVATION_REQUEST:
      return {
        ...state,
        isFetchingMostRecentMeasurement:true,
      }
    case FETCH_RECENT_OBSERVATION_SUCCESS:
      return {
        ...state,
        isFetchingMostRecentMeasurement:false,
        lastUpdated:action.receivedAt,
        mostRecentMeasurements : {
          ...state.mostRecentMeasurements,
          [action.code]: action.recent_obs
        }
      }
    case FETCH_ALL_OBSERVATION_BY_CODE_REQUEST:
      return {
        ...state,
        isFetchingAllMeasurement:true,
      }
    case FETCH_ALL_OBSERVATION_BY_CODE_SUCCESS:
      return {
        ...state,
        isFetchingAllMeasurement:false,
        lastUpdated:action.receivedAt,
        allMeasurements : [
          ...state.allMeasurements,
          action.all_obs_by_code
        ],
        codeList : [
          ...state.codeList,
          action.code
        ]
      }
    default:
      return state
	}
}

export function fhirPatientData(state = {}, action) {
	switch(action.type){
		case FETCH_PATIENT_REQUEST:
			return Object.assign({}, state, {
				isFetchingAllPatientData: true,
			})
		case FETCH_PATIENT_SUCCESS:
			return Object.assign({}, state, {
				isFetchingAllPatientData:false,
				ptData: action.ptData,
				lastUpdated:action.receivedAt
			})
		case FETCH_PATIENT_FAILURE:
			return Object.assign({}, state, {

	    	})
	    default:
	    	return state
	}
}

export function fhirEncounterData(state={}, action){
	switch(action.type){
		case FETCH_RECENT_ENCOUNTER_REQUEST:
			return Object.assign({}, state, {
				isFetchingRecentPatientData: true,
			})
		case FETCH_RECENT_ENCOUNTER_SUCCESS:
			return Object.assign({}, state, {
				isFetchingRecentPatientData:false,
				lastVisit: action.lastVisit,
				lastUpdated:action.receivedAt,
			})
		case FETCH_RECENT_ENCOUNTER_FAILURE:
			return Object.assign({}, state, {
			})
		default:
			return state
	}
}
