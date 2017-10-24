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
    This method categorizes measurements so that 

    @param obs: list of observations

    @return [{"name": "xxxx", "measurements": [{"value": 100, "date": 2017-08-12, "units": mmHg}]}]
**/
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
              {"value": obs[i].resource.component[k].valueQuantity.value,
               "date": obs[i].resource.effectiveDateTime,
                "units": obs[i].resource.component[k].valueQuantity.unit
              }
            );
            found = true;
            break;
          }
        }
        if(!found) {
          sortedMeasures.push(
            {"name": obs[i].resource.component[k].code.text,
             "measurements": [
                {"value": obs[i].resource.component[k].valueQuantity.value,
                 "date": obs[i].resource.effectiveDateTime,
                  "units": obs[i].resource.component[k].valueQuantity.unit
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
      var found = false;
      for(var j = 0; j < sortedMeasures.length; j++) {
        if(sortedMeasures[j].name === obs[i].resource.code.text) {
          sortedMeasures[j].measurements.push(
            {"value": obs[i].resource.valueQuantity.value,
             "date": obs[i].resource.effectiveDateTime,
              "units": obs[i].resource.valueQuantity.unit
            }
          );
          found = true;
          break;
        }
      }
      if(!found) {
        sortedMeasures.push(
          {"name": obs[i].resource.code.text,
           "measurements": [
              {"value": obs[i].resource.valueQuantity.value,
               "date": obs[i].resource.effectiveDateTime,
                "units": obs[i].resource.valueQuantity.unit
              }
            ]
          }
        );
      }
    }
  }
  console.log(sortedMeasures);
  //sort the measurements by date
  return sortedMeasures;
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



