import 'whatwg-fetch'
import { getURL } from '../smart_setup';


// get patient data

export const FETCH_PATIENT_REQUEST = 'FETCH_PATIENT_REQUEST';
export const FETCH_PATIENT_SUCCESS = 'FETCH_PATIENT_SUCCESS';
export const FETCH_PATIENT_FAILURE = 'FETCH_PATIENT_FAILURE';

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
  error: 'oops'
});

// http://fhirtest.uhn.ca/baseDstu3/Patient
export function fetchAllPatientData(patientID) {
  return (dispatch) => {
    dispatch(requestAllPatientData(patientID));
    const baseUrl = getURL();

    return fetch(baseUrl + '/Patient?_id=' + patientID)
      .then(
        response => response.json(),
        error => console.error('An error occured.', error)
      )
      .then(json =>
        dispatch(receiveAllPatientData(patientID, json))
      );
  };
}

function shouldFetchAllPatientData(state, patientID) {
  const data = state.fhirPatientData.ptData;
  if (!data) {
    return true;
  } else if (state.fhirPatientData.isFetchingAllPatientData) {
    return false;
  } else {
    // return posts.didInvalidate
  }
}

export function fetchAllPatientDataIfNeeded(patientID) {
  return (dispatch, getState) => {
    if (shouldFetchAllPatientData(getState(), patientID)) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchAllPatientData(patientID));
    }
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve();
  };
}

// get most recent encounter information
export const FETCH_RECENT_ENCOUNTER_REQUEST = 'FETCH_RECENT_ENCOUNTER_REQUEST';
export const FETCH_RECENT_ENCOUNTER_SUCCESS = 'FETCH_RECENT_ENCOUNTER_SUCCESS';
export const FETCH_RECENT_ENCOUNTER_FAILURE = 'FETCH_RECENT_ENCOUNTER_FAILURE';

export const requestMostRecentEcounterData = patientID => ({
  type: FETCH_RECENT_ENCOUNTER_REQUEST,
  patientID
});

export const receiveMostRecentEncounterData = (patientID, json) => ({
  type: FETCH_RECENT_ENCOUNTER_SUCCESS,
  patientID,
  lastVisit: json.entry[0].resource.period.end,
  receivedAt: Date.now()
});

export const failMostRecentEncounterData = patientID => ({
  type: FETCH_RECENT_ENCOUNTER_FAILURE,
  patientID,
  error: 'oops'
});

// https://fhirtest.uhn.ca/baseDstu3/Encounter?subject=182296&_count=1&_sort=date
export function fetchMostRecentEncounterData(patientID) {
  return (dispatch) => {
    dispatch(requestMostRecentEcounterData(patientID));
    const baseUrl = getURL();

    return fetch(baseUrl + '/Encounter?subject=' + patientID + '&_count=1&_sort=date')
      .then(
        response => response.json(),
        error => console.error('An error occured.', error)
      )
      .then(json =>
        dispatch(receiveMostRecentEncounterData(patientID, json))
      );
  };
}


//get observations data

//get most recent observations by code

// https://fhirtest.uhn.ca/baseDstu3/Observation?subject=182296&_count=1&_sort=date&code=2085-9
export const FETCH_RECENT_OBSERVATION_REQUEST = 'FETCH_RECENT_OBSERVATION_REQUEST';
export const FETCH_RECENT_OBSERVATION_SUCCESS = 'FETCH_RECENT_OBSERVATION_SUCCESS';


export const requestMostRecentObsByCode = (patientID, code) => ({
  type: FETCH_RECENT_OBSERVATION_REQUEST,
  patientID,
  code
});

export const receiveMostRecentObsByCode = (patientID, code, data) => ({
  type: FETCH_RECENT_OBSERVATION_SUCCESS,
  patientID,
  code,
  recent_obs: data,
  receivedAt: Date.now()
});

export function fetchMostRecentObsByCode(patientID, code, subcode = null) {
  return (dispatch, getState) => {
    //TODO include a shouldFetchMostRecentObs after you figure out why it doens't work in the all measurement case
    dispatch(requestMostRecentObsByCode(patientID, code));
    const baseUrl = getURL();
    //get the most recent data
    return fetch(baseUrl + '/Observation?subject=' + patientID + '&code=' + code + '&_count=1&_sort=-date')
      .then(
        response => response.json(),
        error => console.error('An error occured.', error)
      )
      .then(function(json){
          let dataDict = {};
          if(json){
            if(json.total == 0){
              return Promise.resolve();
            }
            else {
              let data = {};
              let item = json.entry[0];
              if(item.resource.component){
                let subdata = item.resource.component;
                for(let part of subdata){
                  if(part.code.coding[0].code == subcode){
                    data = part.valueQuantity;
                    data['date'] = item.resource.effectiveDateTime;
                    //TODO figure out if part.code.coding.text is different from part.code.coding[0].display
                    //apparently, some have text and others have display exclusively, for some ungodly reason.
                    if(!dataDict['name'])
                      dataDict['name'] = part.code.coding[0].display || part.code.text;
                    if(!dataDict['code']){
                      dataDict['code'] = part.code.coding[0].code;
                    }
                  }
                }
              }
              else {
                data = item.resource.valueQuantity;
                data['date'] = item.resource.effectiveDateTime;
                if(!dataDict['name'])
                  dataDict['name'] = item.resource.code.coding[0].display || item.resource.code.text;
                if(!dataDict['code']){
                  dataDict['code'] = item.resource.code.coding[0].code;
                }
              }
              //add our only data element as a list to the return dictionary
              dataDict['measurements'] = [data];
            }
          } 
          else {
            return Promise.resolve();
          }
        dispatch(receiveMostRecentObsByCode(patientID, code, dataDict));
        } 
      );
  };

}

export const FETCH_ALL_OBSERVATION_REQUEST = 'FETCH_ALL_OBSERVATION_REQUEST';
export const FETCH_ALL_OBSERVATION_SUCCESS = 'FETCH_ALL_OBSERVATION_SUCCESS';


export const requestAllObsByCode = (patientID, code) => ({
  type: FETCH_ALL_OBSERVATION_REQUEST,
  patientID,
  code
});

export const receiveAllObsByCode = (patientID, code, data) => ({
  type: FETCH_ALL_OBSERVATION_SUCCESS,
  patientID,
  code: code,
  all_obs: data,
  receivedAt: Date.now()
});

export function shouldFetchAllObsByCode(state, code, subcode = null) {
  let allMeasures = state.fhirObservationData.codeList;
  let fhirObsData = state.fhirObservationData;

  if(allMeasures.length > 0 && !fhirObsData.isFetchingAllMeasurement) {
    for(let measure of allMeasures) {
      if(measure['code'] == code || measure['code'] == subcode){
        return false;
      }
    }    
  }
  return true;
}

export function fetchAllObsByCode(patientID, code, subcode = null) {
  return (dispatch, getState) => {
    //TODO figure out why this doens't work right now. believe it has to do with state updates not occuring immediately. 
    //the solution right now has been to include checks in Dashboard.js before calling fetchAllObsByCode
    if(!shouldFetchAllObsByCode(getState(), code, subcode)) {
      return Promise.resolve();
    }
    dispatch(requestAllObsByCode(patientID, code));
    const baseUrl = getURL();
    //sorted newest to oldest
    return fetch(baseUrl + '/Observation?subject=' + patientID + '&code=' + code + '&_sort=-date')
      .then(
        response => response.json(),
        error => console.error('An error occured.', error)
      )
      .then(function(json){
          let dataDict = {};
          if(json){
            if(json.total == 0){
              return;
            }
            else {
              let dataList = [];
              for(let item of json.entry){
                let data = {};
                if(item.resource.component){
                  let subdata = item.resource.component;
                  for(let part of subdata){
                    if(part.code.coding[0].code == subcode){
                      data = part.valueQuantity;
                      data['date'] = item.resource.effectiveDateTime;
                      //TODO figure out if part.code.coding.text is different from part.code.coding[0].display
                      //apparently, some have text and others have display exclusively, for some ungodly reason.
                      if(!dataDict['name'])
                        dataDict['name'] = part.code.coding[0].display || part.code.text;
                      if(!dataDict['code']){
                        dataDict['code'] = part.code.coding[0].code;
                      }
                    }
                  }
                }
                else {
                  data = item.resource.valueQuantity;
                  data['date'] = item.resource.effectiveDateTime;
                  if(!dataDict['name'])
                    dataDict['name'] = item.resource.code.coding[0].display || item.resource.code.text;
                  if(!dataDict['code']){
                    dataDict['code'] = item.resource.code.coding[0].code;
                  }
                }

                dataList.push(data);
              }
              dataDict['measurements'] = dataList;
            }
          }
        dispatch(receiveAllObsByCode(patientID, code, dataDict));
        } 
      );
  };
}

