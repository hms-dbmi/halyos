import {UPDATE_SMOKING_STATUS, UPDATE_HEART_FAMHIST} from './ExternalActions';

export function externalState(state = {smoking: [false, false, false], heartfamhist: false}, action){
	switch (action.type){
		case UPDATE_SMOKING_STATUS:
			return Object.assign({}, state, {smoking: action.smoking})
		case UPDATE_HEART_FAMHIST:
			return Object.assign({}, state, {heartfamhist: action.heartfamhist})
	    default:
	      return state
	}
}