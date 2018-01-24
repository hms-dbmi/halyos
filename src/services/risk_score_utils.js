const TIME_THRESHOLD = 10000000;

export function findPriorSets(bundles, codes, names, aggBund) {
  var completeSets = [];
  var sizeArr = {};
  for (var bundle in bundles){
    sizeArr[bundle] = bundles[bundle].length;
  }
  var index;
  var minVal;
  var first = true;
  for (var item in sizeArr) {
    if(first) {
      minVal = sizeArr[item];
      index = item;
      first = false;
    }
    if(sizeArr[item] < minVal) {
      minVal = sizeArr[item];
      index = item;
    }
  }
  var iteratorType = bundles[index][0].code.coding[0].code;
  var tempPlace;
  for (var codeSet in codes) {
    if (codes[codeSet].indexOf(iteratorType) > -1) {
      iteratorType = names[codeSet];
      tempPlace = codeSet;
    }
  }
  for(let i = 0; i < aggBund.length; i++) {
    var variablesObject = {};
    if (codes[tempPlace].indexOf(aggBund[i].code.coding[0].code) > -1) {
      variablesObject[iteratorType] = aggBund[i];
      let j = i-1;
      while(j >= 0 && calculateTimeDiffHours(aggBund[j].effectiveDateTime, aggBund[i].effectiveDateTime) < TIME_THRESHOLD) {
        let currName = getCondName(aggBund[j].code.coding[0].code, codes, names);
        if (!(variablesObject.hasOwnProperty(currName))) {
          variablesObject[currName] = aggBund[j];
        }
        j--;
      }
      j = i+1;
      while(j < aggBund.length && calculateTimeDiffHours(aggBund[j].effectiveDateTime, aggBund[i].effectiveDateTime) < TIME_THRESHOLD) {
        let currName = getCondName(aggBund[j].code.coding[0].code, codes, names);
        if (!(variablesObject.hasOwnProperty(currName))) {
          variablesObject[currName] = aggBund[j];
        }
        j++;
      }
      var full = true;
      for(var name in names) {
        if(!(variablesObject.hasOwnProperty(names[name]))) {
          full = false;
        }
      }
      if(full) {
        completeSets.push(variablesObject);
      }
    }
  }
  return completeSets;
}

export function getCondName(condCode, codes, names) {
  for(var codeSet in codes) {
    if(codes[codeSet].indexOf(condCode) > -1) {
      return names[codeSet];
    }
  }
}

export function findClosest(date, measures) {
  
}

/**
  @param: obsBundle -- fetchAll observation bundle
  @param: object -- a javascript object where keys represent the LOINC codes of interest and their values are empty arrays
  @return: object -- a javascript object where the LOINC code keys have values of an array of objects where each 
  object in the array contains code, text, value, date -- ordered by date (most recent is 0 indexed)
  **/
export function searchByCode(obsBundle, object) {
  for (var j = 0; j < obsBundle.length; j++) {
    if(obsBundle[j].resource.component) {
      for (var i = 0; i < obsBundle[j].resource.component.length; i++) {
        let code = obsBundle[j].resource.component[i].code.coding[0].code;
        if(object.hasOwnProperty(code)) {
          object[code].push({
            'code': code,
            'text': obsBundle[j].resource.component[i].code.coding[0].display,
            'value': obsBundle[j].resource.component[i].valueQuantity.value,
            'unit': obsBundle[j].resource.component[i].valueQuantity.unit,
            'date': obsBundle[j].resource.effectiveDateTime,
            'refRanges': obsBundle[j].resource.referenceRange
          });
        }
      }
    }
    else {
      let code = obsBundle[j].resource.code.coding[0].code;
      if(object.hasOwnProperty(code)) {
        object[code].push({
          'code': code,
          'text': obsBundle[j].resource.code.coding[0].display,
          'value': obsBundle[j].resource.valueQuantity.value,
          'unit': obsBundle[j].resource.valueQuantity.unit,
          'date': obsBundle[j].resource.effectiveDateTime,
          'refRanges': obsBundle[j].resource.referenceRange
        });
      }
    }
  }
  return object;
}

/**
  calculate age from date of birthday
  @param dateString: date of birth @return age
*/
export function calculateAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function calculateTimeDiffHours(date1, date2) {
  var today = new Date(date1);
  var measurementDate = new Date(date2);
  var timeDiff = Math.abs(today.getTime() - measurementDate.getTime());
  var diffHours = Math.ceil(timeDiff / (1000 * 3600));
  return diffHours;
}

/**
  @param fetchResult: set of all conditions from a fetchAll call
  @param condID: array with SNOMED ID of conditions
  @return array of condition resources that match IDs in condID array
*/
export function pullCondition(fetchResult, condID) {
  var resultSet = [];
  for (var i = 0; i<fetchResult.length; i++) {
    if (condID.includes(fetchResult[i].resource.code.coding[0].code)) {
      resultSet.push(fetchResult[i]);
    }
  }
  return resultSet;
}

