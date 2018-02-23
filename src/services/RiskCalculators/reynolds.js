/**

    Cardiac Reynolds Risk Score

    @param {int} age - the age of the patient (patient resource)
    @param {int} sysbp - systolic BP (observation resource)
    @param {int} hsCRP - C-Reactive Protein (observation resource)
    @param {int} chol - total cholesterol the patient (observation resource)
    @param {int} hdl - high density lipprotein cholesterol (HDL) the patient (observation resource)
    @param {boolean} smoker - sex of the patient (user input)
    @param {boolean} famHist - sex of the patient (user input)
    @param {string} gender - sex of the patient (patient resource)

    @return cardiac risk score

*/
import {searchByCode, calculateAge} from '../../services/risk_score_utils';
import {getNearestFlat} from '../../services/general_utils';

// const $ = window.$;
// const _ = window._;

// const BP = "55284-4";
// const HSCRP = "30522-7";
// const CHOLESTEROL = "2093-3";
// const HDL = "2085-9";

export function calculateReynolds(age, sysBP, hsCRP, chol, hdl, smoker, famHist, gender) {
  if (gender === "female") {
    let b = 0.0799*age+3.137*Math.log(sysBP)+0.180*Math.log(hsCRP)
    +1.382*Math.log(chol)-1.172*Math.log(hdl);
    if (smoker) {
      b += 0.818;
    }
    if (famHist) {
      b += 0.438;
    }
    let finalScore = 100*(1-Math.pow(0.98756,Math.pow(Math.E,b-22.325)));
    finalScore = finalScore.toFixed(0);
    return finalScore;
  }
  else {
    let b = 4.385*Math.log(age)+2.607*Math.log(sysBP)+0.963*Math.log(chol)
    -0.772*Math.log(hdl)+0.102*Math.log(hsCRP);
    if (smoker) {
      b += 0.405;

    }
    if (famHist) {
      b += 0.541;
    }
    let finalScore = 100*(1-Math.pow(0.8990, Math.pow(Math.E,b-33.097)));
    finalScore = finalScore.toFixed(0);
    return finalScore;
  }
}

export function futureReynolds(presMeasures = null, futureMeasures = null, pt = null, conds = null, meds = null, obs = null, smoker = false, famhist = false) {
  if(presMeasures && pt && futureMeasures) {
      return calculateReynolds(
        calculateAge(pt.birthDate),
        (futureMeasures['8480-6'] || presMeasures['8480-6']),
        (futureMeasures['30522-7'] || presMeasures['30522-7']),
        (futureMeasures['2093-3'] || presMeasures['2093-3']),
        (futureMeasures['2085-9'] || presMeasures['2085-9']),
        smoker, //smoker
        famhist, //famhist
        pt.gender
      );
  }
  else if (presMeasures && pt) {
      return calculateReynolds(
        calculateAge(pt.birthDate),
        presMeasures['8480-6'],
        presMeasures['30522-7'],
        presMeasures['2093-3'],
        presMeasures['2085-9'],
        smoker, //smoker
        famhist, //famhist
        pt.gender
      );
  }
  return '...'
}

export function reynoldsScorePast(date, pt = null, obs = null, conds = null, meds = null, smoker = false, famhist = false) {
    if (pt && obs) {
    const codesObject = {
      '30522-7': [], // hsCRP
      '2093-3': [], // cholesterol
      '2085-9': [], // HDL
      '8480-6': [] // sysBP
    };
    const sortedObs = searchByCode(obs, codesObject);
    for (let key in sortedObs) {
      if (sortedObs.hasOwnProperty(key)) {
        if (sortedObs[key].length === 0) {
          alert('Patient does not have adequate measurements for Reynolds Risk Score.');
          return;
        }
      }
    }
    let yearsYounger = (Date.now()-(new Date(date)))/1000/60/60/24/365
    return calculateReynolds(calculateAge(pt.birthDate)-yearsYounger,
      getNearestFlat(sortedObs['8480-6'], date).value,
      getNearestFlat(sortedObs['30522-7'], date).value,
      getNearestFlat(sortedObs['2093-3'], date).value,
      getNearestFlat(sortedObs['2085-9'], date).value,
      smoker, // smoker
      famhist, // famHist
      pt.gender
    );
  }
  return "..."
}

/**
    @param pt -- the patient resource
    @param obs -- the bundle that contains all observation resources
    @param smoker -- boolean indicating whether or not patient is a smoker; assumes false
    @return the reynolds score as a percent
*/

// export function reynoldsScore(pt, obs, smoker = false, famhist = false) {
//     if (pt && obs) {
//       const codesObject = {
//         '30522-7': [], // hsCRP
//         '2093-3': [], // cholesterol
//         '2085-9': [], // HDL
//         '8480-6': [] // sysBP
//       };
//       const sortedObs = searchByCode(obs, codesObject);
//       for (let key in sortedObs) {
//         if (sortedObs.hasOwnProperty(key)) {
//           if (sortedObs[key].length === 0) {
//             alert('Patient does not have adequate measurements for Reynolds Risk Score.');
//             return;
//           }
//         }
//       }
//       return calculateReynolds(calculateAge(pt.birthDate),
//         sortedObs['8480-6'][0].value,
//         sortedObs['30522-7'][0].value,
//         sortedObs['2093-3'][0].value,
//         sortedObs['2085-9'][0].value,
//         smoker, // smoker
//         famhist, // famHist
//         pt.gender
//       );
//     }
//   return '...';
// }


export function reynoldsScore(date = null, pt, obs, smoker = false, famhist = false) {

    if (pt && obs && date == null) {
      const codesObject = {
        '30522-7': {}, // hsCRP
        '2093-3': {}, // cholesterol
        '2085-9': {}, // HDL
        '55284-4': {} // sysBP --- 55284-4 is the code for both BPs
      };
      // console.log("obs!", obs);
      // const sortedObs = searchByCode(obs, codesObject);
      codesObject['30522-7'] = obs['30522-7'];
      codesObject['2093-3'] = obs['2093-3'];
      codesObject['2085-9'] = obs['2085-9'];
      codesObject['55284-4'] = obs['55284-4'];

      //console.log("reynolds", codesObject);

      for (let key in codesObject) {
        if (codesObject.hasOwnProperty(key)) {
          if (!codesObject[key]) {
            // alert('Patient does not have adequate measurements for Reynolds Risk Score.');
            return;
          }
        }
      }
      return calculateReynolds(calculateAge(pt.birthDate),
        codesObject['55284-4'].value,
        codesObject['30522-7'].value,
        codesObject['2093-3'].value,
        codesObject['2085-9'].value,
        smoker, // smoker
        famhist, // famHist
        pt.gender
      );
    } else if (pt && obs){

    }
  return '...';
}
