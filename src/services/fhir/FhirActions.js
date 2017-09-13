export const requestAllObservations = patientID => ({
  type: 'FETCH_OBSERVATIONS_REQUEST',
  patientID
});

export const receiveAllObservations = (patientID, json) => ({
  type: "FETCH_OBSERVATIONS_SUCCESS",
    patientID,
    obs: json.data.children.map(child => child.data),
    receivedAt: Date.now()
});

export const failAllObservations = patientID => ({
  type: 'FETCH_OBSERVATIONS_FAILURE',
  patientID,
  error:"oops"
});


