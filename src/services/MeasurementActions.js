export const ADD_FUTURE_BY_MEASUREMENT = 'ADD_FUTURE_BY_MEASUREMENT';
export const ADD_PRESENT_BY_MEASUREMENT = 'ADD_PRESENT_BY_MEASUREMENT';
export const ADD_PAST_BY_MEASUREMENT = 'ADD_PAST_BY_MEASUREMENT';
export const SET_TIME_PERIOD = 'SET_TIME_PERIOD';
export const CHANGE_ACTIVE_MEASURE = 'CHANGE_ACTIVE_MEASURE';


export function addFutureMeasurement(code, value) {
	return {
		type: ADD_FUTURE_BY_MEASUREMENT,
		code:code,
		future_value:value
	}
}

export function addPresentMeasurement(code, value) {
	return {
		type: ADD_PRESENT_BY_MEASUREMENT,
		code:code,
		future_value:value
	}
}

export function addPastMeasurement(code, value) {
	return {
		type: ADD_PAST_BY_MEASUREMENT,
		code: code,
		past_value: value
	}
}

export function activeMeasure(code) {
	return {
		type: CHANGE_ACTIVE_MEASURE,
		activeMeasure: code,
	}
}

export function setTimePeriod(time) {
	return {
		type: SET_TIME_PERIOD,
		periodOfTime: time
	}
}

