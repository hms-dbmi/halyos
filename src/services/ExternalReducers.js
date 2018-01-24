import {UPDATE_SMOKING_STATUS} from './ExternalActions';

export function externalState(state = {smoking: [false, false, false]}, action){
	switch (action.type){
		case UPDATE_SMOKING_STATUS:
			return Object.assign({}, state, {smoking: action.smoking})
	    default:
	      return state
	}
}