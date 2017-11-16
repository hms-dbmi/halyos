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
import {searchByCode, calculateAge, pullCondition} from '../../services/risk_score_utils.js';

export function calcCHADScore(age, gender, chf, hypertension, vascDisease, diabetes, strTIAthrom) {
  if (age < 65) {
      age = 0;
    }
  else if (age < 75) {
    age = 1;
  }
  else {
    age = 2;
  }
  var score = age + (gender == "female") + (!(chf.length == 0)) + (!(hypertension.length == 0)) + 
  (!(vascDisease.length == 0)) + (!(diabetes.length == 0)) + 2*(!(strTIAthrom.length == 0));
  var strkRisk;
  switch (score) {
    case 0:
      strkRisk = 0.2;
      break;
    case 1:
      strkRisk = 0.6;
      break;
    case 2:
      strkRisk = 2.2;
      break;
    case 3:
      strkRisk = 3.2;
      break;
    case 4:
      strkRisk = 4.8;
      break;
    case 5:
      strkRisk = 7.2;
      break;
    case 6:
      strkRisk = 9.7;
      break;
    case 7:
      strkRisk = 11.2;
      break;
    case 8:
      strkRisk = 10.8;
      break;
  }
  return strkRisk;
}

export function futureCHAD(presMeasures = null, futureMeasures = null, pt = null, conds = null, meds = null, obs = null) {
 if(conds && pt) {
  return CHADScore(pt, conds);
 }
 return "...";
}

export function CHADPastScore(date, pt = null, obs = null, conds = null, meds = null) {
    if(conds && pt) {
      let filteredConds = [];
      let goalDate = new Date(date);
      for(let i = 0; i < conds.length; i++){
        let currDate = new Date(conds[i].resource.onsetDateTime)
        if(currDate < goalDate) {
          filteredConds.push(conds[i]);
        }
      }
      var chf = pullCondition(conds, ["42343007"]); //byCodes only works w LOINC
      var hypertension = pullCondition(conds, ["38341003"]);
      var vascDisease = pullCondition(conds, ["27550009"]);
      var diabetes = pullCondition(conds, ["73211009"]);
      var strTIAthrom = pullCondition(conds, ["230690007", "266257000", "13713005"]);
      let yearsYounger = (Date.now()-(new Date(date)))/1000/60/60/24/365
      var CHADscore = calcCHADScore(calculateAge(pt.birthDate)-yearsYounger, //age
        pt.gender, //gender
        chf, //chf
        hypertension, //hypertension
        vascDisease, //vascDisease
        diabetes, //diabetes
        strTIAthrom); //strTIAthrom
      return CHADscore;
    }
    return "..."
}

/**
@param pt -- the patient resource
@param conds -- the bundle of all conditions
@return CHAD score as a percent
*/

export function CHADScore(pt, conds){
  if(pt && conds) {
      var chf = pullCondition(conds, ["42343007"]); //byCodes only works w LOINC
      var hypertension = pullCondition(conds, ["38341003"]);
      var vascDisease = pullCondition(conds, ["27550009"]);
      var diabetes = pullCondition(conds, ["73211009"]);
      var strTIAthrom = pullCondition(conds, ["230690007", "266257000", "13713005"]);
      var CHADscore = calcCHADScore(calculateAge(pt.birthDate), //age
        pt.gender, //gender
        chf, //chf
        hypertension, //hypertension
        vascDisease, //vascDisease
        diabetes, //diabetes
        strTIAthrom); //strTIAthrom
      return CHADscore;
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
