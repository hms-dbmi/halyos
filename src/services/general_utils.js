//each array contains the LOINC codes for the measurements used by each risk score
export const riskObject = {
  "General Cardiac": ['30522-7', "2093-3", "2085-9", "8480-6"],
  "Stroke": [],
  "Kidney Failure": ["48643-1", "48642-3", "33914-3","14958-3", "14959-1"],
  "COPD Mortality": ['8480-6', '8462-4','6299-2','9279-1'],
  "Diabetes": ['56115-9', '56114-2', '56117-5', '8280-0', '8281-8','39156-5']
};

//ignore this function, I don't think it's working right

export function isPrimitive (val) {
    // typeof null returns object but for this null is a primitive
    return val === null || ["object","function"].indexOf(typeof val) === -1;
}

export function findPrimitives (obj, callback, propName, path = []) {
    var keys, name;                  
    if(typeof callback !== "function"){
        return undefined;     
    }
    if (typeof obj === "object") {
        keys = Object.keys(obj); 
                                 
    } else {
        if( isPrimitive(obj) ) {
            return callback(obj, propName, path); 
        }
        return false;
    }
    path.push(propName);
    for(name of keys){
        if (isPrimitive(obj[name]) ) {
            if (callback(obj[name], name, path) === true) {  
                return true; 
            }
        } else {
            if (findPrimitives(obj[name], callback, name,  path)) { 
                return true; 
            }
        }
    }
    path.pop();  
    return false;
}

/**
    This method gets the value quantities for any Observation resource, regardless of if its a compound measurement (like BP) or a normal Observation, and does the callback on it

    @param obList: list of observations
    @param id: string to match
    @param callback: function to perform on the matches

    @return transformed matches after callback
**/
export function getValueQuantities(obs, callback){
    //components exist so you have to get the quantities from there and do something with them
    if(obs.component){
        for (let comp of obs.component){
                callback(obs,comp);

        }
        return;
    }
        callback(obs,obs);

}

//calculate age from date of birthday
//@param dateString: date of birth 
//@return age
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

/**
  @param: obsBundle -- fetchAll observation bundle
  @param: object -- a javascript object where keys represent the LOINC codes of interest and their values are empty arrays
  @return: object -- a javascript object where the LOINC code keys have values of an array of objects where each 
  object in the array contains code, text, value, date -- ordered by date (most recent is 0 indexed)
  **/
export function searchByCode(obsBundle, object) {
  for (var j = 0; j < obsBundle.length; j++) {
    if(obsBundle[j].component) {
      for (var i = 0; i < obsBundle[j].component.length; i++) {
        var code = obsBundle[j].component[i].code.coding[0].code;
        if(object.hasOwnProperty(code)) {
          object[code].push({
            'code': code,
            'text': obsBundle[j].component[i].code.coding[0].display,
            'value': obsBundle[j].component[i].valueQuantity.value,
            'unit': obsBundle[j].component[i].valueQuantity.unit,
            'date': obsBundle[j].effectiveDateTime,
            'refRanges': obsBundle[j].referenceRange
          });
        }
      }
    }
    else {
      var code = obsBundle[j].code.coding[0].code;
      if(object.hasOwnProperty(code)) {
        object[code].push({
          'code': code,
          'text': obsBundle[j].code.coding[0].display,
          'value': obsBundle[j].valueQuantity.value,
          'unit': obsBundle[j].valueQuantity.unit,
          'date': obsBundle[j].effectiveDateTime,
          'refRanges': obsBundle[j].referenceRange
        });
      }
    }
  }
  return object;
}

/**
  
    This function takes two latitude/longitude points and calculates the difference between them using the Haversine algorithm
    source: https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula

    @param lat1: source latitude
    @param lon1: source longitude
    @param lat2: destination latitude
    @param lon2: destination longitude

    @return: distance
*/

export function coordDistance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

//@param fetchResult: set of all conditions from a fetchAll call
//@param condID: array with SNOMED ID of conditions
//@return array of condition resources that match IDs in condID array
export function pullCondition(fetchResult, condID) {
  var resultSet = [];
  for (var i = 0; i<fetchResult.length; i++) {
    if (condID.includes(fetchResult[i].code.coding[0].code)) {
      resultSet.push(fetchResult[i]);
    }
  }
  return resultSet;
}
