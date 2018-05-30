/**
  
    COPD Mortality Risk Score

    @param {int} age - the age of the patient (patient resource)
    @param {list} confusion - condition records of confusion (condition resource)
    @param {int} bun - blood urea nitrogen levels (observation resource)
    @param {int} rr - respiratory rate (observation resource)
    @param {int} sysbp - systolic BP (observation resource)
    @param {int} diasbp - diastolic BP (observation resource)

    @return COPD Mortality risk score

*/

import {searchByCode, calculateAge, pullCondition} from '../../services/risk_score_utils.js';
import {getNearestFlat} from '../../services/general_utils';

export function calcCOPD(age, confusion, bun, rr, sysbp, diasbp) {
	var score = Number((age >= 65)) + Number((!(confusion.size == null))) + Number((bun > 19)) +
	Number((rr >= 30)) + Number(((sysbp < 90) || (diasbp <= 60)));
    var mortality = 'N/A';
    switch (score) {
      case 0:
        mortality = 0.6;
        break;
      case 1:
        mortality = 2.7;
        break;
      case 2:
        mortality = 6.8;
        break;
      case 3:
        mortality = 14;
        break;
      case 4:
        mortality = 27.8;
        break;
      case 5:
        mortality = 27.8;
        break;
      default:
        mortality = "N/A";
    }
    return mortality;
}

export function pastCOPDScore(date, pt = null, obs = null, conds = null, meds = null) {
    if(pt && obs && conds) {
        var confusion = pullCondition(conds, ["40917007"]); //could be reprogrammed for O(n) instead of O(n*m) if time
        var measurementObject = {
            '8480-6': [], //sysBP
            '8462-4': [], //diasBP
            '6299-2': [], //bun
            '9279-1': [] //rr
        };
        var sortedObs = searchByCode(obs, measurementObject);
        for (var key in sortedObs) {
            if(sortedObs.hasOwnProperty(key)) {
                if(sortedObs[key].length === 0) {
                    alert("Patient does not have adequate measurements for COPD Risk Score.");
                    ////console.log(sortedObs);
                    return;
                }
            }
        }
        let filteredConfusion = false;
        let goalDate = new Date(date);
        for(let i = 0; i < confusion.length; i++){
            let currDate = new Date(confusion[i].resource.onsetDateTime)
            if(currDate < goalDate) {
                filteredConfusion = true;
            }
        }
        let yearsYounger = (Date.now()-(new Date(date)))/1000/60/60/24/365
        let COPDScore = calcCOPD(calculateAge(pt.birthDate)-yearsYounger,
            filteredConfusion,
            getNearestFlat(sortedObs['6299-2'], date).value,
            getNearestFlat(sortedObs['9279-1'], date).value,
            getNearestFlat(sortedObs['8480-6'], date).value,
            getNearestFlat(sortedObs['8462-4'], date).value
            )
        return COPDScore;
    }
    else {
        return '...'
    }
}

export function futureCOPD(presMeasures = null, futureMeasures = null, pt = null, conds = null, meds = null, obs = null) {
  if(presMeasures && pt && futureMeasures) {
      return calcCOPD(
        calculateAge(pt.birthDate),
        conds && pullCondition(conds, ["40917007"]).length !== 0,
        (futureMeasures['6299-2'] || presMeasures['6299-2']),
        (futureMeasures['9279-1'] || presMeasures['9279-1']),
        (futureMeasures['8480-6'] || presMeasures['8480-6']),
        (futureMeasures['8462-4'] || presMeasures['8462-4']),
      );
  }
  else if (presMeasures && pt) {
      return calcCOPD(
        calculateAge(pt.birthDate),
        conds && pullCondition(conds, ["40917007"]).length !== 0,
        presMeasures['6299-2'],
        presMeasures['9279-1'],
        presMeasures['8480-6'],
        presMeasures['8462-4']
      );
  }
  return '...'
}

/**
    @param pt -- the patient resource
    @param obs -- the bundle that contains all observation resources
    @param conds -- the bundle that contains all condition resources
    @return the COPD score as a percent
*/

export function COPDScore(pt, obs, conds) {
    console.log(pt, obs, conds)
    if(pt && obs && conds) {
        var confusion = pullCondition(conds, ["40917007"]); //could be reprogrammed for O(n) instead of O(n*m) if time
        var sortedObs = {
            '8480-6': obs['8480-6'], //sysBP
            '8462-4': obs['8462-4'], //diasBP
            '6299-2': obs['6299-2'], //bun
            '9279-1': obs['9279-1'] //rr
        };
        //var sortedObs = searchByCode(obs, measurementObject);
        for (var key in sortedObs) {
            if(sortedObs.hasOwnProperty(key)) {
                if(!sortedObs[key]) {
                    ////console.log(sortedObs);
                    return '...';
                }
            }
        }
        if(sortedObs['8480-6'].measurements && sortedObs['8462-4'].measurements
             && sortedObs['6299-2'].measurements && sortedObs['9279-1'].measurements &&
             sortedObs['8480-6'].measurements[0] && sortedObs['8462-4'].measurements[0]
             && sortedObs['6299-2'].measurements[0] && sortedObs['9279-1'].measurements[0]) {
            var COPDScore = calcCOPD(calculateAge(pt.birthDate),
                confusion,
                sortedObs['6299-2'].measurements[0].value,
                sortedObs['9279-1'].measurements[0].value,
                sortedObs['8480-6'].measurements[0].value,
                sortedObs['8462-4'].measurements[0].value);
            return COPDScore;
        } else {
            return '...';
        }
    }
    else {
        return '...'
    }
}
// function getCOPD() {
// 	var smart = getPatID("patCOPDRisk");
// 	var score;
// 	var conditions = smart.patient.api.fetchAll({type: "Condition", query: {code: {$or: ['40917007']}}});
// 	var labs = smart.patient.api.fetchAll({type: "Observation", query: {code: {$or: [
//            //BUN
//            'http://loinc.org|6299-2',
//            //BP
//            'http://loinc.org|55284-4', 
//            //Resp Rate
//            'http://loinc.org|9279-1'
//            ]}}});
// 	$.when(getPatient(smart), conditions, labs).done(function(patRaw, conditions, labs) {
// 		console.log(patRaw, conditions, labs);
// 		let validPatient = true;
// 		if (patRaw.data.total == 0) {
// 		  alert("This patient does not exist.");
// 		  validPatient = false;
// 		}
// 		else {
// 		  var age = calculateAge(patRaw.data.entry[0].resource.birthDate);
// 		}
// 		var confusion = pullCondition(conditions, ["40917007"]); //byCodes only works w LOINC
// 		labs = _.sortBy(labs, 'effectiveDateTime').reverse();
// 		var byCodes = smart.byCodes(labs, 'code');
//     	var bunArr = byCodes("6299-2");
//     	var bpArr = byCodes("55284-4");
//     	var rrArr = byCodes("9279-1");
//     	var bunScore = 0;
//     	var bpScore = 0;
//     	var rrScore = 0;
// 	    var scoreSets = findPriorSets({bunArr, bpArr, rrArr}, [["6299-2"], ["55284-4"], ["9279-1"]],['bun', 'bp', 'rr'], labs);
// 	    console.log(scoreSets);
// 	    if (!(scoreSets) || scoreSets.length === 0) {
// 	      validPatient = false;
// 	      alert("There are not enough measurements");
// 	      return;
// 	    }
// 	    score = (age >= 65) + (!(confusion.size == null)) + (scoreSets[0]['bun'].valueQuantity.value > 19)
// 	    + (scoreSets[0]['rr'].valueQuantity.value >= 30)
// 	    + ((scoreSets[0]['bp'].component[0].valueQuantity.value < 90) || (scoreSets[0]['bp'].component[1].valueQuantity.value <= 60));
// 	    var mortality = 'N/A';
// 	    switch (score) {
// 	      case 0:
// 	        mortality = 0.6;
// 	        break;
// 	      case 1:
// 	        mortality = 2.7;
// 	        break;
// 	      case 2:
// 	        mortality = 6.8;
// 	        break;
// 	      case 3:
// 	        mortality = 14;
// 	        break;
// 	      case 4:
// 	        mortality = 27.8;
// 	        break;
// 	      case 5:
// 	        mortality = 27.8;
// 	        break;
// 	    }
// 	    alert("Your pneumonia has a " + mortality + "% 30-day mortality rate.");
// 	});
// }