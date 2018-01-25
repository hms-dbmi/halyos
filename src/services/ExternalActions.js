export const UPDATE_SMOKING_STATUS = 'UPDATE_SMOKING_STATUS';
export const UPDATE_HEART_FAMHIST = 'UPDATE_HEART_FAMHIST';

export function updateSmoking(value) {
	return {
		type: UPDATE_SMOKING_STATUS,
		smoking: value,
	}
}

export function updateHeartfamhist(value) {
	return {
		type: UPDATE_HEART_FAMHIST,
		heartfamhist: value,
	}
}
