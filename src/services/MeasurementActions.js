export const ADD_FUTURE_BY_MEASUREMENT = 'ADD_FUTURE_BY_MEASUREMENT';

export function addFutureMeasurement(code, value) {
	return {
		type: ADD_FUTURE_BY_MEASUREMENT,
		code:code,
		future_value:value
	}
}

