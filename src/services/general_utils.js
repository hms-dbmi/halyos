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