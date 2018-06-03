import $ from 'jquery'; 
import { coordDistance } from '../general_utils';

export function getPtLoc(patient) {
	console.log(patient);
	if(typeof patient.then !== 'function') { //buggy temp fix to stop app from crashing since rn we're feeding in a promise
		var ptAddress;
		if(!patient[0].address){
			$.getJSON('http://freegeoip.net/json/?callback=?', function(data) {
				  ptAddress = data;
			})
		}
		else {
			var fullAddress = patient[0].address[0];
			$.getJSON('https://api.opencagedata.com/geocode/v1/json?q='+ fullAddress.postalCode + '&countrycode='+ fullAddress.country+'&no_annotations=1&key=bc76774a452346449916c91155a0b96b', function(data) {
				  //console.log("what da hell", data.results[0])
			  ptAddress = {
				"country_code":fullAddress.country,
				"region_code":fullAddress.state,
				"city":fullAddress.city,
				"zip_code":fullAddress.postalCode,
				"latitude":data.results[0].geometry.lat,
				"longitude":data.results[0].geometry.lng
				}
			})
		}
		return ptAddress;
	}
	return null;
}

export function findClosestMarker(data, lat, long) {
  var leastDistanceAway = Number.POSITIVE_INFINITY;
  var closestPoint;
  var dist;

  for (let destination of data){
    if (destination.latitude && destination.longitude){
       dist = coordDistance(parseInt(lat), parseInt(long), parseInt(destination.latitude), parseInt(destination.longitude));
    }
    else {
      continue;
    }

    //This corresponds to 5 miles (I'm pretty sure)
    if (leastDistanceAway < 0.07){
      break;
    }
    if (leastDistanceAway > dist){
      closestPoint = destination;
      leastDistanceAway = dist;
    }
  }

  return closestPoint;  
}
