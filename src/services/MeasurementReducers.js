import { ADD_FUTURE_BY_MEASUREMENT, ADD_PRESENT_BY_MEASUREMENT, SET_TIME_PERIOD, ADD_PAST_BY_MEASUREMENT, CHANGE_ACTIVE_MEASURE } from './MeasurementActions';

export function measurementState(state = {}, action){
	switch (action.type){
		case ADD_FUTURE_BY_MEASUREMENT:
			return {
				...state,
				futureMeasurements : {
					...state.futureMeasurements,
					[action.code]: action.future_value
				}
			}
		case ADD_PRESENT_BY_MEASUREMENT:
			return {
				...state,
				presentMeasurements : {
					...state.presentMeasurements,
					[action.code]: action.future_value
				}
			}
		case ADD_PAST_BY_MEASUREMENT:
			return {
				...state,
				pastMeasurements : {
					...state.pastMeasurements,
					[action.code]: action.past_value
				}
			}
		case SET_TIME_PERIOD:
				return Object.assign({}, state, {periodOfTime: action.periodOfTime})
		case CHANGE_ACTIVE_MEASURE:
				return Object.assign({}, state, {activeMeasure: action.activeMeasure})
	    default:
	      return state
	}
}
