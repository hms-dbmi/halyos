export const riskObject = {
  "General Cardiac": ['30522-7', "2093-3", "2085-9", "8480-6"],
  "Stroke": [],
  "Kidney Failure": ["48643-1", "48642-3", "33914-3","14958-3", "14959-1"],
  "COPD Mortality": ['8480-6', '8462-4','6299-2','9279-1'],
  "Diabetes": ['56115-9', '56114-2', '56117-5', '8280-0', '8281-8','39156-5']
};

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

/**
    This method categorizes measurements so a list of observations can be placed in the format in the return tag.
    Importantly however, this is only if the data is pulled from the fhir.js JAVASCRIPT CLIENT. It's a different format than from a fetch call. 
    
    TODO: really, the right way to do this is to convert the local data, since it is the incorrect format and pull it out properly, so that it matches
      the data pulled from the server. 

      local data: 
      [{fullUrl:..., resource:..., search:...}{...}]
      server data:
      [{resourceType:..., code:..., (other resource fields)}{...}]
  
    @param obs: list of observations

    @return [{"name": "xxxx", "code": "xxxx-xx", measurements": [{"value": 100, "date": 2017-08-12, "unit": mmHg}]}], 
    not guaranteed to be sorted by date but server response is sorted by date, so for all intents and purposes can assume this is true
**/
export function sortMeasurementsFromClient(obs){
  var sortedMeasures = []
  for(var i = 0; i < obs.length; i++) {
    if(obs[i].component) {
      for(var k = 0; k < obs[i].component.length; k++) {
        var found = false;
        if(!obs[i].component[k].code.text) {
          obs[i].component[k].code.text = obs[i].code.coding[0].display
        }
        if(!obs[i].effectiveDateTime) {
          obs[i].effectiveDateTime = obs[i].issued
        }
        for(var j = 0; j < sortedMeasures.length; j++) {
          if(sortedMeasures[j].name === obs[i].component[k].code.text) {
            sortedMeasures[j].measurements.push(
              {"value": obs[i].component[k].valueQuantity.value.toFixed(2),
               "date": obs[i].effectiveDateTime,
                "unit": obs[i].component[k].valueQuantity.unit
              }
            );
            found = true;
            break;
          }
        }
        if(!found) {
          sortedMeasures.push(
            {"name": obs[i].component[k].code.text,
             "code": obs[i].component[k].code.coding[0].code,
             "measurements": [
                {"value": obs[i].component[k].valueQuantity.value.toFixed(2),
                 "date": obs[i].effectiveDateTime,
                  "unit": obs[i].component[k].valueQuantity.unit
                }
              ]
            }
          );
        }
      }
    }
    else {
      if(!obs[i].code.text) {
        obs[i].code.text = obs[i].code.coding[0].display
      }
      let found = false;
      for(let j = 0; j < sortedMeasures.length; j++) {
        if(sortedMeasures[j].name === obs[i].code.text) {
          sortedMeasures[j].measurements.push(
            {"value": obs[i].valueQuantity.value.toFixed(2),
             "date": obs[i].effectiveDateTime,
              "unit": obs[i].valueQuantity.unit
            }
          );
          found = true;
          break;
        }
      }
      if(!found) {
        sortedMeasures.push(
          {"name": obs[i].code.text,
           "code": obs[i].code.coding[0].code,
           "measurements": [
              {"value": obs[i].valueQuantity.value.toFixed(2),
               "date": obs[i].effectiveDateTime,
                "unit": obs[i].valueQuantity.unit
              }
            ]
          }
        );
      }
    }
  }
  return sortedMeasures;
}

export function sortMeasurements(obs){
  var sortedMeasures = []
  for(var i = 0; i < obs.length; i++) {
    if(obs[i].resource.component) {
      for(var k = 0; k < obs[i].resource.component.length; k++) {
        var found = false;
        if(!obs[i].resource.component[k].code.text) {
          obs[i].resource.component[k].code.text = obs[i].resource.code.coding[0].display
        }
        if(!obs[i].resource.effectiveDateTime) {
          obs[i].resource.effectiveDateTime = obs[i].resource.issued
        }
        for(var j = 0; j < sortedMeasures.length; j++) {
          if(sortedMeasures[j].name === obs[i].resource.component[k].code.text) {
            sortedMeasures[j].measurements.push(
              {"value": obs[i].resource.component[k].valueQuantity.value.toFixed(2),
               "date": obs[i].resource.effectiveDateTime,
                "unit": obs[i].resource.component[k].valueQuantity.unit
              }
            );
            found = true;
            break;
          }
        }
        if(!found) {
          sortedMeasures.push(
            {"name": obs[i].resource.component[k].code.text,
             "code": obs[i].resource.component[k].code.coding[0].code,
             "measurements": [
                {"value": obs[i].resource.component[k].valueQuantity.value.toFixed(2),
                 "date": obs[i].resource.effectiveDateTime,
                  "unit": obs[i].resource.component[k].valueQuantity.unit
                }
              ]
            }
          );
        }
      }
    }
    else {
      if(!obs[i].resource.code.text) {
        obs[i].resource.code.text = obs[i].resource.code.coding[0].display
      }
      let found = false;
      for(let j = 0; j < sortedMeasures.length; j++) {
        if(sortedMeasures[j].name === obs[i].resource.code.text) {
          sortedMeasures[j].measurements.push(
            {"value": obs[i].resource.valueQuantity.value.toFixed(2),
             "date": obs[i].resource.effectiveDateTime,
              "unit": obs[i].resource.valueQuantity.unit
            }
          );
          found = true;
          break;
        }
      }
      if(!found) {
        sortedMeasures.push(
          {"name": obs[i].resource.code.text,
           "code": obs[i].resource.code.coding[0].code,
           "measurements": [
              {"value": obs[i].resource.valueQuantity.value.toFixed(2),
               "date": obs[i].resource.effectiveDateTime,
                "unit": obs[i].resource.valueQuantity.unit
              }
            ]
          }
        );
      }
    }
  }
  return sortedMeasures;
}



/** 
    
    This function converts a list of observations to a dictionary so it can be used for various searching functions. The list is more useful
    when you need to iterate through the entire list of observations. 
*/ 
export function listToDictMeasurements(obs){
  
  var dictOfMeasures = {};
  for(let measurement of obs){
    dictOfMeasures[measurement.code] = measurement;
  }

  return dictOfMeasures;
}

/** 
  
  This function takes in the final data, after the fetch and ETL operations. This means it must come DIRECTLY from the redux data store
  for this method to work.

*/
export function sortByDate(obsList){

  // even though we really don't need to (since we can assume ISO date format) we parse the date in case here.
  obsList.sort((obs1,obs2) => {
    return new Date(obs2.date) - new Date(obs1.date);
  })
  return obsList;
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

/**
  
    This function takes in an array of sorted observations (from sortMeasurements) and a target date, and outputs the closest measurement

    @param obs: bundle of observations in descending order
    @param date: date of interest

    @return: observation resource
*/

export function getNearestFlat(obs, date) { //make this binary search
  let currDate = new Date(obs[0].date)
  let goalDate = new Date(date)
  let minTime = Math.abs(currDate-goalDate);
  let minIndex = 0;
  for (var i = 1; i < obs.length; i++) {
    currDate = new Date(obs[i].date)
    if(Math.abs(currDate-goalDate) < minTime) {
      minTime = Math.abs(currDate-goalDate)
      minIndex = i;
    }
  }
  return obs[minIndex]
}

/**
  
    This function takes in a bundle of observations and a target date, and outputs the closest measurement

    @param obs: bundle of observations in descending order
    @param date: date of interest

    @return: observation resource
*/

export function getNearest(obs, date) {
  var prevObs;
  var currObs;
  // start at the front of the observation bundle & go backwards
  // stop once the date is older than date
  // compare of that date + prevDate to determine which is closer
  // return
  // return oldest measurement possible if no data available
  for (var i = 0; i < obs.length; i++) {
    currObs = obs[0][i];
    if (obs[0][i].effectiveDateTime > date) {
      prevObs = currObs;
    }
    else {
      break;
    }
  }
  if ((prevObs.effectiveDateTime-date) > (date-currObs.effectiveDateTime)) {
    return currObs;
  }
  return prevObs;
}



