/**@param smart: the FHIR client instance that this request should be sent to
        patID: the patient ID in question
        n: how many top observations you want
  @return: returns an object with n observations that represent those with the most prevalence
        the key is the LOINC code of the measurement and the value is a set that contains all the resource objects
**/
import $ from 'jquery'; 
export function getTopObservations(smart, n) {
 	var obs = smart.patient.api.fetchAll({type: "Observation", query:{$sort: [['code','asc']], _elements:['code']}});
	$.when(obs, n).done(function(bundle, n) {
	  var observations = {};
	  for (i in bundle) {
	    var name = bundle[i].code.coding[0].display;
	    if (observations.hasOwnProperty(name)) {
	      observations[name].push(bundle[i]);
	    }
	    else {
	      observations[name] = [bundle[i]];
	    }
	  }
	  console.log(observations);
	  var count = 0;
	  var finalArray = [];
	  for (var i = 0; i < n; i++) {
	    finalArray.push([0]);
	  }
	  for (var key in observations) {
	    if (observations.hasOwnProperty(key)) {
	      observations[key].unshift(observations[key].length);
	      if(finalArray[count][0] < observations[key].length) {
	        finalArray[count] = observations[key]
	        count = (count+1) % n;
	      }
	    }
	  }
	  for (var i = 0; i < finalArray.length; i++) {
	    finalArray[i].shift();
	  }
	  console.log(finalArray);
	});
}