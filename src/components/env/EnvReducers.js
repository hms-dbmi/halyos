import { FETCH_POLLEN_REQUEST, FETCH_POLLEN_SUCCESS, FETCH_POLLEN_FAILURE } from './EnvActions'
import { FETCH_AIQ_REQUEST, FETCH_AIQ_SUCCESS } from './EnvActions'
import { FETCH_FLU_REQUEST, FETCH_FLU_SUCCESS } from './EnvActions'

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
      case FETCH_AIQ_REQUEST:
      case FETCH_AIQ_SUCCESS:
      case FETCH_FLU_REQUEST:
      case FETCH_FLU_SUCCESS:
	    default:
	      return state
	}
}
