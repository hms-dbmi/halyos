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
// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))

export function fetchAllObservations(patientID) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestAllObservations(patientID))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    var base_url = getURL();

    return fetch(base_url + "/Observation?patient=" + patientID)
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing an loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log('An error occured.', error)
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveAllObservations(patientID, json))
      )
  }
}