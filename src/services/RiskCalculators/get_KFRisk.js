/**
  
    Kidney Failure Risk Score
    
    @param {string} gender - sex of the patient (patient resource)
    @param {int} age - the age of the patient (patient resource)
    @param {int} gfr - condition record of glomerular (glow-MAIR-you-lure) filtration rate (condition resource)
    @param {int} uac - condition record of urine analysis with culture (condition resource)

    @return kidney failure risk score

*/
import {calculateAge, pullCondition} from '../../services/risk_score_utils.js';

export function calcKFRisk(gender, age, gfr, uac) {
  if (gender == "male") {gender = 1;}
  else if (gender == "female") {gender = 0;}
  var a = 0.2694*gender-0.2167*age/10-0.55418*gfr/5+0.45608*Math.log(uac);
  var score = 100*(1-Math.pow(0.924, Math.pow(Math.E, a+2.96774)));
  score = score.toFixed(0);
  return score;
}

export function futureKFRRisk(presMeasures = null, futureMeasures = null, pt = null, obs = null, conds = null, meds = null) {
  if(presMeasures && pt && futureMeasures) {
      return calcKFRisk(
        pt.gender,
        calculateAge(pt.birthDate),
        futureMeasures['48643-1'] || futureMeasures['48642-3'] || futureMeasures['33914-3'] || presMeasures['48643-1'] || presMeasures['48642-3'] || presMeasures['33914-3'],
        futureMeasures['14958-3'] || futureMeasures['14959-1']|| presMeasures['14958-3'] || presMeasures['14959-1']
      );
  }
  else if (presMeasures && pt) {
      return calcKFRisk(
        pt.gender,
        calculateAge(pt.birthDate),
        presMeasures['48643-1'] || presMeasures['48642-3'] || presMeasures['33914-3'],
        presMeasures['14958-3'] || presMeasures['14959-1']
      );
  }
  return '...'
}

/**
    @param pt -- the patient resource
    @param obs -- the bundle that contains all observation resources
    @return the kidney failure risk score as a percent
*/
export function KFRScore(pt, obs) {
  if(pt && obs) {
    var gfr = pullCondition(obs, ["48643-1", "48642-3", "33914-3"]); //could be reprogrammed for O(n) instead of O(n*m) if time
    var uac = pullCondition(obs, ["14958-3", "14959-1"]);
    if(gfr.length == 0 || uac.length == 0) {
      //console.log("KF score", gfr, uac);
      alert("Patient does not have enough measurements for Kidney Risk Score");
      return;
    }
    else {
      if(gfr[0].resource.component) {
        gfr[0] = gfr[0].resource.component[0];
      }
      var KFRisk = calcKFRisk(pt.gender, 
      calculateAge(pt.birthDate), 
      gfr[0].valueQuantity.value, //gfr
      uac[0].resource.valueQuantity.value); //uac
    }
    return KFRisk;
  }
  else {
    return '...'
  }
}

// function CKDtoKF() { //add units check
//   var smart = getPatID("patIDKF");
//   var score;
//   var labs = smart.patient.api.fetchAll({type: "Observation", query: {code: {$or: ['http://loinc.org|48643-1',
//            'http://loinc.org|48642-3', 'http://loinc.org|33914-3',
//            'http://loinc.org|14958-3', 'http://loinc.org|14959-1']}}});
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
//     labs = _.sortBy(labs, 'effectiveDateTime').reverse();
//     var byCodes = smart.byCodes(labs, 'code');
//     var GFRArr = byCodes("48643-1", "48642-3", "33914-3");
//     var UACArr = byCodes("14958-3", "14959-1");
//     var scoreSets = findPriorSets({GFRArr, UACArr},
//       [["48643-1", "48642-3", "33914-3"], ["14958-3", "14959-1"]],
//       ['gfr', 'uac'], labs);
//     console.log(GFRArr);
//     console.log(UACArr);
//     if (scoreSets.length === 0) {
//       validPatient = false;
//     }
//     if(validPatient) {
//       for (var i = 0; i < scoreSets.length; i++) {
//         let a = 0.2694*gender-0.2167*age/10-0.55418*scoreSets[i]['gfr'].valueQuantity.value/5+
//         0.45608*Math.log(scoreSets[i]['uac'].valueQuantity.value);
//         score = 100*(1-Math.pow(0.924, Math.pow(Math.E, a+2.96774)));
//         score = score.toFixed(2);
//         let sum = 0;
//         let counter = 0;
//         let tempTime;
//         let maxTime = 0;
//         for(variable in scoreSets[i]) {
//           tempTime = new Date(scoreSets[i][variable].effectiveDateTime);
//           sum += tempTime.getTime();
//           if (tempTime > maxTime) {
//             maxTime = tempTime;
//           }
//           counter++;
//         }
//         avgDate = new Date(sum/counter)
//         console.log("As of " + new Date(maxTime) + "the probability your CKD would have resulted in kidney failure in the next five years was " + score + "%.");
//         //alert("As of " + new Date(maxTime) + "the probability your CKD would have resulted in kidney failure in the next five years was " + score + "%.");
//       }
//     }
//     else {
//       alert("This patient is missing measurements that are necessary to making the prediction.");
//     }
//   });
// }