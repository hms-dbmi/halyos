import fetch from 'isomorphic-fetch'

import { getURL } from '../smart_setup'

//get observations

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

//get patient data

export const FETCH_PATIENT_REQUEST = "FETCH_PATIENT_REQUEST";
export const FETCH_PATIENT_SUCCESS = "FETCH_PATIENT_SUCCESS";
export const FETCH_PATIENT_FAILURE = "FETCH_PATIENT_FAILURE";

export const requestAllPatientData = patientID => ({
  type: FETCH_PATIENT_REQUEST,
  patientID
});

export const receiveAllPatientData = (patientID, json) => ({
  type: FETCH_PATIENT_SUCCESS,
  patientID,
  ptData: json.entry[0].resource,
  receivedAt: Date.now()
});

export const failAllPatientData = patientID => ({
  type: FETCH_PATIENT_FAILURE,
  patientID,
  error:"oops"
});

 //http://fhirtest.uhn.ca/baseDstu3/Patient
export function fetchAllPatientData(patientID) {
  
  return function (dispatch) {
  
    dispatch(requestAllPatientData(patientID))
    var base_url = getURL();

    return fetch(base_url + "/Patient?_id=" + patientID)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json =>
        dispatch(receiveAllPatientData(patientID, json))
      )
  }
}


