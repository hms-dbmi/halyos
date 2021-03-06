import { FETCH_ALL_OBSERVATION_REQUEST, FETCH_ALL_OBSERVATION_SUCCESS, FETCH_ALL_OBSERVATION_FAILURE} from './FhirActions'
import { FETCH_PATIENT_REQUEST, FETCH_PATIENT_SUCCESS, FETCH_PATIENT_FAILURE } from './FhirActions'
import { FETCH_RECENT_ENCOUNTER_REQUEST, FETCH_RECENT_ENCOUNTER_SUCCESS, FETCH_RECENT_ENCOUNTER_FAILURE } from './FhirActions'
import { FETCH_RECENT_OBSERVATION_REQUEST, FETCH_RECENT_OBSERVATION_SUCCESS } from './FhirActions'
import { FETCH_ALL_OBSERVATION_BY_CODE_REQUEST, FETCH_ALL_OBSERVATION_BY_CODE_SUCCESS, FETCH_ALL_OBSERVATION_BY_CODE_FAILURE } from './FhirActions';
import { FETCH_LAST_VISIT_DATE_REQUEST, FETCH_LAST_VISIT_DATE_SUCCESS } from './FhirActions';
import { FETCH_ALL_CONDITION_REQUEST, FETCH_ALL_CONDITION_SUCCESS, FETCH_ALL_CONDITION_FAILURE } from './FhirActions';
import { FETCH_ALL_MEDREQ_REQUEST, FETCH_ALL_MEDREQ_SUCCESS, FETCH_ALL_MEDREQ_FAILURE } from './FhirActions';


const initialFhirState = {
  "allMeasurements" : [],
  "mostRecentMeasurements" : [],
  "allMeasurementsByCode" : [],
  "codeList" : [],
  "isFetchingAllMeasurementByCodeList" : {},
};
export function fhirObservationData(state = initialFhirState, action){
	switch (action.type){
    case FETCH_RECENT_OBSERVATION_REQUEST:
      return {
        ...state,
        isFetchingMostRecentMeasurement:true,
      }
    case FETCH_RECENT_OBSERVATION_SUCCESS:
      return {
        ...state,
        isFetchingMostRecentMeasurement:false,
        lastUpdated:action.receivedAt,
        mostRecentMeasurements : [
          ...state.mostRecentMeasurements,
          action.recent_obs
        ]
      }
    case FETCH_ALL_OBSERVATION_BY_CODE_REQUEST:
      return {
        ...state,
        isFetchingAllMeasurementByCodeList: {
          ...state.isFetchingAllMeasurementByCodeList,
          [action.code]:true
        }
      }
    case FETCH_ALL_OBSERVATION_BY_CODE_SUCCESS:
      return {
        ...state,
        isFetchingAllMeasurementByCodeList: {
          ...state.isFetchingAllMeasurementByCodeList,
          [action.code]:false
        },
        lastUpdated:action.receivedAt,
        allMeasurementsByCode : [
          ...state.allMeasurementsByCode,
          action.all_obs_by_code
        ],
        codeList : [
          ...state.codeList,
          action.code
        ]
      }
    case FETCH_ALL_OBSERVATION_BY_CODE_FAILURE:
      return {
        ...state,
        isFetchingAllMeasurementByCodeList: {
          ...state.isFetchingAllMeasurementByCodeList,
          [action.code]:false
        },
        failedFetchingAllMeasurementByCode:true,
        lastUpdated:action.receivedAt,
      }

    case FETCH_ALL_OBSERVATION_REQUEST:
      return {
        ...state,
        isFetchingAllMeasurement:true,
      }
    case FETCH_ALL_OBSERVATION_SUCCESS:
      let newArr = state.allMeasurementsByCode.slice();
      action.all_other_obs.forEach((newMeas) => {
        if (
          state.allMeasurementsByCode
            .every(extMeas => extMeas.code !== newMeas.code)
        ) {
          newArr.push(newMeas);
        }
      });
      if (newArr.length === state.allMeasurementsByCode.length) {
        newArr = state.allMeasurementsByCode;
      }
      return {
        ...state,
        isFetchingAllMeasurement: false,
        lastUpdated: action.receivedAt,
        allMeasurementsByCode : newArr,
      }
    case FETCH_ALL_OBSERVATION_FAILURE:
      return {
        ...state,
        isFetchingAllMeasurement:false,
        lastUpdated:action.receivedAt,
        failedFetchAllMeasurement: true,
      }

    default:
      return state
	}
}

export function fhirPatientData(state = {}, action) {
	switch(action.type){
		case FETCH_PATIENT_REQUEST:
			return Object.assign({}, state, {
				isFetchingAllPatientData: true,
			})
		case FETCH_PATIENT_SUCCESS:
			return Object.assign({}, state, {
				isFetchingAllPatientData:false,
				ptData: action.ptData,
				lastUpdated:action.receivedAt
			})
    case FETCH_PATIENT_FAILURE:
      return Object.assign({}, state, {
        isFetchingAllPatientData: false,
        failedFetchPatientData: true,
        lastUpdated: action.receivedAt,
      })

    case FETCH_LAST_VISIT_DATE_REQUEST:
      return Object.assign({}, state, {
        isFetchingLastVisitDate: true,
      })
    case FETCH_LAST_VISIT_DATE_SUCCESS:
      return Object.assign({}, state, {
          isFetchingLastVisitDate: false,
          lastVisit:action.lastVisit,
        })
	    default:
	    	return state
	}
}

export function fhirEncounterData(state={}, action){
	switch(action.type){
		case FETCH_RECENT_ENCOUNTER_REQUEST:
			return Object.assign({}, state, {
				isFetchingRecentPatientData: true,
			})
		case FETCH_RECENT_ENCOUNTER_SUCCESS:
			return Object.assign({}, state, {
				isFetchingRecentPatientData:false,
				lastVisit: action.lastVisit,
				lastUpdated:action.receivedAt,
			})
		case FETCH_RECENT_ENCOUNTER_FAILURE:
			return Object.assign({}, state, {
			})
		default:
			return state
	}
}

export function fhirConditionData(state={allCondData:[]}, action){
  switch(action.type){
    case FETCH_ALL_CONDITION_REQUEST:
      return Object.assign({}, state, {
        isFetchingAllConditionData: true,
      })
    case FETCH_ALL_CONDITION_SUCCESS:
      return Object.assign({}, state, {
        isFetchingAllConditionData:false,
        allCondData: action.allCondData,
        lastUpdated:action.receivedAt,
      })
    case FETCH_ALL_CONDITION_FAILURE:
      return Object.assign({}, state, {
      })
    default:
      return state
  }
}

export function fhirMedReqData(state={allMedReqData:[]}, action){
  switch(action.type){
    case FETCH_ALL_MEDREQ_REQUEST:
      return Object.assign({}, state, {
        isFetchingMedReqData: true,
      })
    case FETCH_ALL_MEDREQ_SUCCESS:
      return Object.assign({}, state, {
        isFetchingMedReqData:false,
        allMedReqData: action.allMedReqData,
        lastUpdated:action.receivedAt,
      })
    case FETCH_ALL_MEDREQ_FAILURE:
      return Object.assign({}, state, {
      })
    default:
      return state
  }
}
