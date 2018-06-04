/**
  
    CHAD Risk Score for Stroke
    
    @param {int} age - the age of the patient (patient resource)
    @param {string} gender - sex of the patient (patient resource)
    @param {list} chf - condition records of congestive heart failure (condition resource)
    @param {list} hypertension - condition records of congestive heart failure (condition resource)
    @param {list} vascDisease - condition records of vascular disease (condition resource)
    @param {list} diabetes - condition records of diabetes (condition resource)
    @param {list} strTIAthrom - condition records of TIA (condition resource)

    @return CHAD risk score

*/
import {calculateAge, pullCondition, searchByCode} from '../../services/risk_score_utils.js';
import {getNearestFlat, sortMeasurements} from '../../services/general_utils';

export function calcCHADScore(age, BMI, diabetes, astalt, platelet, albumin) {
  var score = -1.675 + 
              (0.037*age) + 
              (0.094*BMI) + 
              (1.13*(diabetes.length !== 0)) + 
              (0.99*astalt) +
              (-0.013*platelet) +
              (-0.66*albumin);
  if(score < -1.455) {
    return (22.0/295.0*100).toPrecision(2);
  }
  else if(score > 0.676) {
    return (64.0/71.0*100).toPrecision(2);
  }
  else {
    return (39.0/114.0*100).toPrecision(2);
  }
}

export function futureCHAD(presMeasures = null, futureMeasures = null, pt = null, conds = null, meds = null, obs = null) {
 if(presMeasures && pt && futureMeasures) {
  return calcCHADScore(calculateAge(pt.birthDate),
                      (futureMeasures['39156-5'] || presMeasures['39156-5']),
                      pullCondition(conds, ["73211009", "44054006", "46635009"]).length !== 0,
                      (futureMeasures['1916-6'] || presMeasures['1916-6']),
                      (futureMeasures['777-3'] || presMeasures['777-3']),
                      (futureMeasures['1751-7'] || presMeasures['1751-7']))
 }
 return "...";
}

export function CHADPastScore(date, pt = null, obs = null, conds = null, meds = null) {
    if(conds && pt && obs) {
      let filteredConds = [];
      let goalDate = new Date(date);
      for(let i = 0; i < conds.length; i++){
        let currDate;

        if(conds[i].resource == null){
          currDate = new Date(conds[i].onsetDateTime)
        } else {
          currDate = new Date(conds[i].resource.onsetDateTime)
        }
        if(currDate < goalDate) {
          filteredConds.push(conds[i]);
        }
      }
      const codesObject = {
        '39156-5': [],
        '1916-6': [],
        '777-3': [],
        '1751-7': [] 
      };

      // due to the differences in where the data comes from, we have to check if we got the original data bundle
      // or if it is preprocessed from remote server by redux.
      let sortedObs;
      if(Array.isArray(obs[0])){
        sortedObs = sortMeasurements(obs);
      } else if (Object.keys(obs).length !== 0) {
        sortedObs = obs;
        // we want to make sure we have all of the necessary obs before we proceed.
        if (!sortedObs.hasOwnProperty('39156-5') || !sortedObs.hasOwnProperty('1916-6') || 
            !sortedObs.hasOwnProperty('777-3') || !sortedObs.hasOwnProperty('1751-7')) {
          return "...";
        }

      } else {
        return "...";
      }


      if(sortedObs['39156-5'].length !== 0 && sortedObs['1916-6'].length !== 0 &&
        sortedObs['777-3'].length !== 0 && sortedObs['1751-7'].length !== 0) {
          var diabetes = pullCondition(conds, ["73211009", "44054006", "46635009"]);
          let yearsYounger = (Date.now()-(new Date(date)))/1000/60/60/24/365
          var CHADscore = calcCHADScore(calculateAge(pt.birthDate)-yearsYounger, //age
                          getNearestFlat(sortedObs['39156-5'].measurements, date).value, //bmi, ~20
                          diabetes, //diabetes
                          getNearestFlat(sortedObs['1916-6'].measurements, date).value, //ast/alt ratio, normal ~2
                          getNearestFlat(sortedObs['777-3'].measurements, date).value, //platelet, ~100
                          getNearestFlat(sortedObs['1751-7'].measurements, date).value); //albumin, ~4
          return CHADscore;
      }
      return '...'
    }
    return "..."
}

/**
@param pt -- the patient resource
@param conds -- the bundle of all conditions
@return CHAD score as a percent
*/

export function CHADScore(pt, conds, obs){
  if(pt && conds && obs) {
      // we have to make this check since the server and local data are slightly different formats, done with the wrapper method below
      var diabetes = pullCondition(conds, ["73211009", "44054006", "46635009"]);
      if(obs['39156-5'] && obs['1916-6'] &&
        obs['777-3'] && obs['1751-7']) {
          var CHADscore = calcCHADScore(calculateAge(pt.birthDate), //age
                          obs['39156-5'].measurements[0].value, //bmi, ~20
                          diabetes, //diabetes
                          obs['1916-6'].measurements[0].value, //ast/alt ratio, normal ~2
                          obs['777-3'].measurements[0].value, //platelet, ~100
                          obs['1751-7'].measurements[0].value); //albumin, ~4
          return CHADscore;
      }
      else {
        return '...'
      }
  }
  else {
    return '...'
  }
}

// function strokeRisk() { //add units check
//   var smart = getPatID("patIDStroke");
//   var score;
//   var labs = smart.patient.api.fetchAll({type: "Condition", query: {code: {$or: ['42343007','38341003',
//    '230690007', '266257000', '13713005', '27550009', '73211009']}}});
//   $.when(getPatient(smart), labs).done(function(patRaw, labs) {
//     let validPatient = true;
//     if (patRaw.data.total == 0) {
//       alert("This patient does not exist.");
//       validPatient = false;
//     }
//     else {
//       var age = calculateAge(patRaw.data.entry[0].resource.birthDate);
//       var gender = patRaw.data.entry[0].resource.gender;
//       if (gender == "male") {gender = 1;}
//       else if (gender == "female") {gender = 0;}
//       else {alert("Patient has no gender.");}
//     }
    // var chf = pullCondition(labs, ["42343007"]); //byCodes only works w LOINC
    // var hypertension = pullCondition(labs, ["38341003"]);
    // var vascDisease = pullCondition(labs, ["27550009"]);
    // var diabetes = pullCondition(labs, ["73211009"]);
    // var strTIAthrom = pullCondition(labs, ["230690007", "266257000", "13713005"]);
//     if (age < 65) {
//       age = 0;
//     }
//     else if (age < 75) {
//       age = 1;
//     }
//     else {
//       age = 2;
//     }
//     score = age + (gender == "female") + (chf.length != 0) + (hypertension.length != 0) +
//     (vascDisease.length != 0) + (diabetes.length != 0) + 2*(strTIAthrom.length != 0);
//     var strkRisk;
//     switch (score) {
//       case 0:
//         strkRisk = 0.2;
//         break;
//       case 1:
//         strkRisk = 0.6;
//         break;
//       case 2:
//         strkRisk = 2.2;
//         break;
//       case 3:
//         strkRisk = 3.2;
//         break;
//       case 4:
//         strkRisk = 4.8;
//         break;
//       case 5:
//         strkRisk = 7.2;
//         break;
//       case 6:
//         strkRisk = 9.7;
//         break;
//       case 7:
//         strkRisk = 11.2;
//         break;
//       case 8:
//         strkRisk = 10.8;
//         break;
//     }
//     if(validPatient) {
//       alert("Your stroke risk is " + strkRisk + "% per year.");
//     }
//     else {
//       alert("This patient is missing measurements that are necessary to making the prediction.");
//     }
//   });
// }
