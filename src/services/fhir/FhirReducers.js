import { requestAllObservations, receiveAllObservations, failAllObservations, FETCH_OBSERVATIONS_REQUEST, FETCH_OBSERVATIONS_SUCCESS, FETCH_OBSERVATIONS_FAILURE  } from './FhirActions'

function fhirPatientData(state = {}, action){
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
	    	

	    default:
	      return state
	}
}