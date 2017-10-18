import { FETCH_OBSERVATIONS_REQUEST, FETCH_OBSERVATIONS_SUCCESS, FETCH_OBSERVATIONS_FAILURE  } from './FhirActions'
import { FETCH_PATIENT_REQUEST, FETCH_PATIENT_SUCCESS, FETCH_PATIENT_FAILURE } from './FhirActions'

export function fhirObservationData(state = {}, action){
	switch (action.type){
		case FETCH_OBSERVATIONS_REQUEST:
			return Object.assign({}, state, {
		        isFetchingAllObs: true,
		      })
	    case FETCH_OBSERVATIONS_SUCCESS:
	    	return Object.assign({}, state, {
		        isFetchingAllObs: false,
		        obs: action.obs,
		        lastUpdated: action.receivedAt
		      })
	    case FETCH_OBSERVATIONS_FAILURE:
	    	return Object.assign({}, state, {

	    	})

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