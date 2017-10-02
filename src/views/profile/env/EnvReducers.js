import { FETCH_POLLEN_REQUEST, FETCH_POLLEN_SUCCESS, FETCH_POLLEN_FAILURE } from './EnvActions'

export function envFactorsData(state = {}, action){
	switch (action.type){
		case FETCH_POLLEN_REQUEST:
			return Object.assign({}, state, {
		        isFetchingPollenData: true,
		      })
	    case FETCH_POLLEN_SUCCESS:
	    	return Object.assign({}, state, {
		        isFetchingPollenData: false,
		        pollenLevels: action.pollenLevels,
		        lastUpdated: action.receivedAt
		      })
	    case FETCH_POLLEN_FAILURE:
	    	return Object.assign({}, state, {

	    	})

	    default:
	      return state
	}
}