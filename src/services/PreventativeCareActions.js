import 'whatwg-fetch'

//utils
import { calculateAge } from './risk_score_utils';
// get patient data

export const FETCH_PREV_CARE_SUGGESTIONS_REQUEST = 'FETCH_PREV_CARE_SUGGESTIONS_REQUEST';
export const FETCH_PREV_CARE_SUGGESTIONS_SUCCESS = 'FETCH_PREV_CARE_SUGGESTIONS_SUCCESS';
export const FETCH_PREV_CARE_SUGGESTIONS_FAILURE = 'FETCH_PREV_CARE_SUGGESTIONS_FAILURE';


export const requestPreventativeCareData = () => ({
  type: FETCH_PREV_CARE_SUGGESTIONS_REQUEST,
});

export const receivePreventativeCareData = (json) => ({
  type: FETCH_PREV_CARE_SUGGESTIONS_SUCCESS,
  prevCare: json,
  receivedAt: Date.now()
});

export const failurePreventativeCareData = () => ({
  type:FETCH_PREV_CARE_SUGGESTIONS_FAILURE,
  receivedAt: Date.now()

})

// http://fhirtest.uhn.ca/baseDstu3/Patient
export function fetchPreventativeCareSuggestions(birthDate, gender) {
  return (dispatch) => {
    dispatch(requestPreventativeCareData());
    const URL = 'https://healthfinder.gov/api/v2/myhealthfinder.json?api_key=fwafjtozprnxlbbb&age=';
    const getUrl = (birthDate, gender) => `${URL}${calculateAge(birthDate) || 40}&sex=${gender}`;
    return fetch(getUrl(birthDate, gender))
      .then(
        response => {
          // you can do this>, which is dope. do it elsewhere!
          if(!response.ok){
            dispatch(failurePreventativeCareData());
            return Promise.resolve();

          } else {
            return response.json();

          }
        },
        error => {
          console.warn('An error occured fetching the preventative care suggestions :(', error);
          dispatch(failurePreventativeCareData());
          return Promise.resolve();
        }
      )
      .then((json) => {
        if(json == null || json.Result.Error === "True"){
          dispatch(failurePreventativeCareData());
          return Promise.resolve();
        }
        dispatch(receivePreventativeCareData(json))
      }
      );
  };
}

