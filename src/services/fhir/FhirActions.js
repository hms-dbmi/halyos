import 'whatwg-fetch'
import { getURL, getInsecureURL } from '../smart_setup';
import { sortMeasurements } from '../general_utils'

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

export const FETCH_ALL_OBSERVATION_BY_CODE_REQUEST = 'FETCH_ALL_OBSERVATION_BY_CODE_REQUEST';
export const FETCH_ALL_OBSERVATION_BY_CODE_SUCCESS = 'FETCH_ALL_OBSERVATION_BY_CODE_SUCCESS';


export const requestAllObsByCode = (patientID, code) => ({
  type: FETCH_ALL_OBSERVATION_BY_CODE_REQUEST,
  id: patientID,
  code: code
});

export const receiveAllObsByCode = (patientID, code, data) => ({
  type: FETCH_ALL_OBSERVATION_BY_CODE_SUCCESS,
  patientID,
  code: code,
  all_obs_by_code: data,
  receivedAt: Date.now()
});

export function shouldFetchAllObsByCode(state, code, subcode = null) {
  let currFetchingList = state.fhirObservationData.isFetchingAllMeasurementByCodeList;
  if( currFetchingList.hasOwnProperty(code) || currFetchingList.hasOwnProperty(subcode)) {
    return false;
  }

  let allMeasures = state.fhirObservationData.codeList;  
  for(let measure of allMeasures) {
    if(measure == code || measure == subcode){
      return false;
    }
  }    
  return true;
}

export function fetchAllObsByCode(patientID, code, subcode = null) {
  return (dispatch, getState) => {
    // checks if we need to fetch, only does so if there isn't already a request out or we don't have the measurement yet.
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
          let outputCode = "";
          if(json){
            if(json.total == 0){
              return Promise.resolve();
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
                      if(!(dataDict.hasOwnProperty('name'))) {

                        dataDict['name'] = part.code.coding[0].display || part.code.text;
                      }
                      if(!dataDict.hasOwnProperty('code')){
                        dataDict['code'] = part.code.coding[0].code;
                        outputCode = part.code.coding[0].code;
                      }
                      break;
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
                    outputCode = item.resource.code.coding[0].code;
                  }
                }

                dataList.push(data);
              }
              dataDict['measurements'] = dataList;
            }
          }
        dispatch(receiveAllObsByCode(patientID, outputCode, dataDict));
      });
  };
}

export const FETCH_ALL_OBSERVATION_REQUEST = 'FETCH_ALL_OBSERVATION_REQUEST';
export const FETCH_ALL_OBSERVATION_SUCCESS = 'FETCH_ALL_OBSERVATION_SUCCESS';


// we will get all the observations, regardless of code
export const requestAllObs = (patientID) => ({
  type: FETCH_ALL_OBSERVATION_REQUEST,
  patientID,
})

export const receiveAllObs = (patientID, data) => ({
  type: FETCH_ALL_OBSERVATION_SUCCESS,
  patientID,
  all_other_obs: data,
  receivedAt: Date.now()
})

// TODO: complete this after figuring out how to do an excluded list fetchAll from fhir.js or otherwise.
// use this queryObject: var queryDictPiece = {'subject':patientID, 'code': {'$and': [{'$not':'30522-7'}, {'$not':'20565-8'}, {'$not':'6298-4'}]}}
export function fetchAllObsExcluded(patientID, excludeCodeList) {
  return (dispatch, getState) => {
    dispatch(requestAllObs(patientID));

    
    const baseUrl = getURL();
    // we take all the LOINC codes that have already been collected, so we don't do it again and do the rest of them.
    // ex: https://fhirtest.uhn.ca/baseDstu3/Observation?subject=240225&code:not=30522-7&code:not=38483-4
    // NOTE: there is a very slight caveat that if you have more than 114 different codes that you want to include, the URL becomes too long for some browsers (specifically IE)
    let excludedCodeURL = baseUrl + '/Observation?subject=' + patientID;
    for (let code of excludeCodeList){
      excludedCodeURL += ('&code:not=' + code)
    }

    // var mkFhir = require('fhir.js');
    
    // var client = mkFhir({
    //   baseUrl: getURL()
    // });

    // client
    //   .fetchAll({type: 'Observation', query: {'subject':getPatID().toString()}})
    //   .then(function(res){
    //     var bundle = res.data;
    //     // var count = (bundle.entry && bundle.entry.length) || 0;
    //     console.log("# Patients born in 1974: ", res);
    //   })
    //   .catch(function(res){
    //     console.log("error res", res);
    //     //Error responses
    //     if (res.status){
    //         console.log('Error1', res.status);
    //     }

    //     //Errors
    //     if (res.message){
    //         console.log('Error1', res.message);
    //     }
    //   });


    return fetch(excludeCodeList)
      .then(
        response => response.json(),
        error => console.error('An error occured.', error)
      )
      .then(function(json){


      });


  }
}

export function fetchAllObs(patientID) {
  return (dispatch, getState) => {
    dispatch(requestAllObs(patientID));
    const baseUrl = getURL();

    var mkFhir = require('fhir.js');
    var client = mkFhir({
      baseUrl: getInsecureURL()
    });

    //sort by code
    client
      .fetchAll({type: 'Observation', query: {'subject':patientID, '$sort': [['code','asc']]}})
      .then(function(res){
        var bundle = res;
        let currObsIdx = 0;
        let currObs = bundle[currObsIdx].code.coding[0].code;

        if(!bundle){
          return Promise.resolve();
        }
        var allObsList = [];

        // here we use another method to pull data elements out of the obs bundle and place them in the form of: 
        // [{"name": "xxxx", "code": "xxxx-xx", measurements": [{"value": 100, "date": 2017-08-12, "unit": mmHg}]}]
        allObsList = sortMeasurements(bundle)

        // TODO: is there a right way to do this?
        let currState = getState();
        let currCodesCollected = currState.fhirObservationData.codeList;
        let allUncollectedMeasures = [];

        for(let measure of allObsList){
          if(currCodesCollected.indexOf(measure.code) < 0){
            allUncollectedMeasures.push(measure);
          }
        }
        dispatch(receiveAllObs(patientID, allUncollectedMeasures));
      })
      .catch(function(res){
        //Error responses
        return Promise.resolve();
        if (res.status){
        }

        //Errors
        if (res.message){
        }
      });
  }
}

