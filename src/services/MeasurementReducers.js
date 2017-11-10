import { ADD_FUTURE_BY_MEASUREMENT, ADD_PRESENT_BY_MEASUREMENT } from './MeasurementActions';



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
	    default:
	      return state
	}
}