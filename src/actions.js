export const SET_PAST_DATE = 'SET_PAST_DATE';

export function setPastDate(pastDate){
  return {
  	type: 'SET_PAST_DATE',
  	payload: { pastDate },
	}
};
