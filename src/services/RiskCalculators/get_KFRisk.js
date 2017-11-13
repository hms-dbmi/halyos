/**
  
    Kidney Failure Risk Score
    
    @param {string} gender - sex of the patient (patient resource)
    @param {int} age - the age of the patient (patient resource)
    @param {int} gfr - condition record of glomerular (glow-MAIR-you-lure) filtration rate (condition resource)
    @param {int} uac - condition record of urine analysis with culture (condition resource)

    @return kidney failure risk score

*/
import {calculateAge, pullCondition, searchByCode} from '../../services/risk_score_utils.js';
import {getNearestFlat} from '../../services/general_utils';

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

export function pastKFRRisk(date, pt = null, obs = null, conds = null, meds = null) {
  if(pt && obs) {
    const codesObject = {
      "48643-1": [],
      "48642-3": [],
      "33914-3": [],
      "14958-3": [],
      "14959-1": []
    };
    const sortedObs = searchByCode(obs, codesObject);
    codesObject["48643-1"] = codesObject["48643-1"].concat(codesObject["48642-3"])
    codesObject["48643-1"] = codesObject["48643-1"].concat(codesObject["33914-3"]);
    codesObject["14958-3"] = codesObject["14958-3"].concat(codesObject["14959-1"]);
    if(codesObject["48643-1"].length == 0 || codesObject["14958-3"].length == 0) {
        alert("Patient does not have enough measurements for Kidney Risk Score");
        return;
    }
    else {
      return calcKFRisk(pt.gender,
        calculateAge(pt.birthDate),
        getNearestFlat(codesObject["48643-1"], date).value,
        getNearestFlat(codesObject['14958-3'], date).value
        )
    }
  }
  return "..."
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