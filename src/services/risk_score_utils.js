const TIME_THRESHOLD = 10000000;

export function findPriorSets(bundles, codes, names, aggBund) {
  var completeSets = [];
  var sizeArr = {};
  for (bundle in bundles){
    sizeArr[bundle] = bundles[bundle].length;
  }
  var index;
  var minVal;
  var first = true;
  for (item in sizeArr) {
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
  for (codeSet in codes) {
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
        var currName = getCondName(aggBund[j].code.coding[0].code, codes, names);
        if (!(variablesObject.hasOwnProperty(currName))) {
          variablesObject[currName] = aggBund[j];
        }
        j--;
      }
      j = i+1;
      while(j < aggBund.length && calculateTimeDiffHours(aggBund[j].effectiveDateTime, aggBund[i].effectiveDateTime) < TIME_THRESHOLD) {
        var currName = getCondName(aggBund[j].code.coding[0].code, codes, names);
        if (!(variablesObject.hasOwnProperty(currName))) {
          variablesObject[currName] = aggBund[j];
        }
        j++;
      }
      var full = true;
      for(name in names) {
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
  for(codeSet in codes) {
    if(codes[codeSet].indexOf(condCode) > -1) {
      return names[codeSet];
    }
  }
}

//calculate age from date of birthday
//@param dateString: date of birth @return age
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

export function pullCondition(fetchResult, condID) {
  var resultSet = [];
  for (var i = 0; i<fetchResult.length; i++) {
    if (condID.includes(fetchResult[i].code.coding[0].code)) {
      resultSet.push(fetchResult[i]);
    }
  }
  return resultSet;
}