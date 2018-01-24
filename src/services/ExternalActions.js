export const UPDATE_SMOKING_STATUS = 'UPDATE_SMOKING_STATUS';

export function updateSmoking(value) {
	return {
		type: UPDATE_SMOKING_STATUS,
		smoking: value,
	}
}
