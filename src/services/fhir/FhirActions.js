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


