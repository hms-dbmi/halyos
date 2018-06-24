/**
  
    Kidney Failure Risk Score
    
    @param {string} gender - sex of the patient (patient resource)
    @param {int} age - the age of the patient (patient resource)
    @param {int} gfr - condition record of glomerular (glow-MAIR-you-lure) filtration rate (condition resource)
    @param {int} uac - condition record of urine analysis with culture (condition resource)

    @return kidney failure risk score

*/
import {calculateAge} from '../../services/risk_score_utils.js';
import {getNearestFlat, sortMeasurements} from '../../services/general_utils';

export function calcKFRisk(gender, age, gfr, uac) {
  if (gender === "male") {gender = 1;}
  else if (gender === "female") {gender = 0;}
  var a = 0.2694*gender-0.2167*age/10-0.55418*gfr/5+0.45608*Math.log(uac);
  var score = 100*(1-Math.pow(0.924, Math.pow(Math.E, a+2.96774)));
  score = score.toFixed(0);
  return score;
}

function hasNecessaryMeasuresForKFRRisk(presMeasures = null, futureMeasures = null){
  if(presMeasures == null || futureMeasures == null){
    return false;
  }
    if( (futureMeasures.hasOwnProperty('48643-1') ||
         futureMeasures.hasOwnProperty('48642-3') ||
         futureMeasures.hasOwnProperty('33914-3') || 
         futureMeasures.hasOwnProperty('48643-1') ||
         futureMeasures.hasOwnProperty('48642-3') || 
         futureMeasures.hasOwnProperty('33914-3')) 
      && (futureMeasures.hasOwnProperty('14958-3') || 
          futureMeasures.hasOwnProperty('14959-1')|| 
          presMeasures.hasOwnProperty('14958-3') || 
          presMeasures.hasOwnProperty('14959-1')) ) {
      return true;
    } else {
      return false;
    }

}

export function futureKFRRisk(presMeasures = null, futureMeasures = null, pt = null, obs = null, conds = null, meds = null) {
  if(hasNecessaryMeasuresForKFRRisk(presMeasures, futureMeasures)){

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
}
  return '...'
}

export function pastKFRRisk(date, pt = null, obs = null, conds = null, meds = null) {
  if(pt && obs) {
    // const codesObject = {
    //   "48643-1": [],
    //   "48642-3": [],
    //   "33914-3": [],//
    //   "14958-3": [],
    //   "14959-1": []//
    // };

    // due to the differences in where the data comes from, we have to check if we got the original data bundle
    // or if it is preprocessed from remote server by redux.
    let sortedObs;
    if(Array.isArray(obs[0])){
      sortedObs = sortMeasurements(obs);
    } else if (Object.keys(obs).length !== 0) {
      sortedObs = obs;

      // we want to make sure we have all of the necessary obs before we proceed.
      if (!(sortedObs.hasOwnProperty("48643-1") || sortedObs.hasOwnProperty("48642-3") || sortedObs.hasOwnProperty("33914-3")) || 
          !(sortedObs.hasOwnProperty("14959-1") || !sortedObs.hasOwnProperty("14958-3")) 
          ) {
        return "...";
      }

    } else {
      return "...";
    }
    let gfrMeasurements = [];
    let uacMeasurements = [];

    if(sortedObs.hasOwnProperty("48643-1"))
      gfrMeasurements = gfrMeasurements.concat(sortedObs["48643-1"].measurements);
    if(sortedObs.hasOwnProperty("48642-3"))
      gfrMeasurements = gfrMeasurements.concat(sortedObs["48642-3"].measurements);
    if(sortedObs.hasOwnProperty("33914-3")) {
      gfrMeasurements = gfrMeasurements.concat(sortedObs["33914-3"].measurements);
    }

    if(sortedObs.hasOwnProperty("14959-1"))
      uacMeasurements = uacMeasurements.concat(sortedObs["14959-1"].measurements)
    if(sortedObs.hasOwnProperty("14958-3"))
      uacMeasurements = uacMeasurements.concat(sortedObs["14958-3"].measurements)

    if(gfrMeasurements.length === 0 || uacMeasurements.length === 0) {
        //alert("Patient does not have enough measurements for Kidney Risk Score");
        return '...';
    }
    else {
      let yearsYounger = (Date.now()-(new Date(date)))/1000/60/60/24/365
      return calcKFRisk(pt.gender,
        calculateAge(pt.birthDate)-yearsYounger,
        getNearestFlat(gfrMeasurements, date).value,
        getNearestFlat(uacMeasurements, date).value
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
    var gfr = obs['33914-3'] //could be reprogrammed for O(n) instead of O(n*m) if time
    var uac = obs['14959-1']
    if(gfr && uac) {
      //console.log("KF score", gfr, uac);
            // if(grf && gfr[0].resource.component) {
      //   gfr[0] = gfr[0].resource.component[0];
      // }
      if(gfr.measurements && uac.measurements && gfr.measurements[0] && uac.measurements[0]) {
        var KFRisk = calcKFRisk(pt.gender, 
        calculateAge(pt.birthDate), 
        gfr.measurements[0].value, //gfr
        uac.measurements[0].value); //uac
        return KFRisk;
      } else {
        return '...'
      }
    }
    else {
        return '...';
    }
  }
  else {
    return '...'
  }
}
