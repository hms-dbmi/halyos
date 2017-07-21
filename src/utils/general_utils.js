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
/**
  @param: obsBundle -- fetchAll observation bundle
  @param: object -- a javascript object where keys represent the LOINC codes of interest & they correspond to empty arrays
  @return: object -- a javascript object where the keys correspond to array of objects where each 
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
            'date': obsBundle[j].effectiveDateTime
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
          'date': obsBundle[j].effectiveDateTime
        });
      }
    }
  }
  return object;
}
