import fetch from 'isomorphic-fetch'

import { getURL } from '../smart_setup'

export const FETCH_OBSERVATIONS_REQUEST = "FETCH_OBSERVATIONS_REQUEST";
export const FETCH_OBSERVATIONS_SUCCESS = "FETCH_OBSERVATIONS_SUCCESS";
export const FETCH_OBSERVATIONS_FAILURE = "FETCH_OBSERVATIONS_FAILURE";

export const requestAllObservations = patientID => ({
  type: FETCH_OBSERVATIONS_REQUEST,
  patientID
});

export const receiveAllObservations = (patientID, json) => ({
  type: FETCH_OBSERVATIONS_SUCCESS,
    patientID,
    obs: json,
    receivedAt: Date.now()
});

export const failAllObservations = patientID => ({
  type: FETCH_OBSERVATIONS_FAILURE,
  patientID,
  error:"oops"
});

 //http://fhirtest.uhn.ca/baseDstu3/Observation?patient=140570
export function fetchAllObservations(patientID) {
  
  return function (dispatch) {
  
    dispatch(requestAllObservations(patientID))
    var base_url = getURL();

    return fetch(base_url + "/Observation?patient=" + patientID)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>
        dispatch(receiveAllObservations(patientID, json))
      )
  }
}