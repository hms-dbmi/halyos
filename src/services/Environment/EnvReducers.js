import { FETCH_POLLEN_REQUEST, FETCH_POLLEN_SUCCESS, FETCH_POLLEN_FAILURE } from './EnvActions'
import { FETCH_AIQ_REQUEST, FETCH_AIQ_SUCCESS, FETCH_AIQ_FAILURE } from './EnvActions'
import { FETCH_FLU_REQUEST, FETCH_FLU_SUCCESS, FETCH_FLU_FAILURE } from './EnvActions'

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
        isFetchingPollenData: false,
        failureFetchPollenData: true,
        lastUpdated: action.receivedAt
      })  
    case FETCH_AIQ_REQUEST:
      return Object.assign({}, state, {
        isFetchingAIQData: true,
      })
    case FETCH_AIQ_SUCCESS:
      return Object.assign({}, state, {
        isFetchingAIQData: false,
        aiqLevels: action.aiqLevels,
        lastUpdated: action.receivedAt
      })
    case FETCH_AIQ_FAILURE:
      return Object.assign({}, state, {
        isFetchingAIQData: false,
        failureFetchAIQData: true,
        lastUpdated: action.receivedAt
      })      
    case FETCH_FLU_REQUEST:
      return Object.assign({}, state, {
        isFetchingFluData: true,
      })
    case FETCH_FLU_SUCCESS:
      return Object.assign({}, state, {
        isFetchingFluData: false,
        closestFluMarker: action.fluMarkers,
        lastUpdated: action.receivedAt
      })
    case FETCH_FLU_FAILURE:
      return Object.assign({}, state, {
        isFetchingFluData: false,
        failureFetchFluData: true,
        lastUpdated: action.receivedAt
      }) 
    default:
      return state
	}
}
