/**@param bundle: the bundle of observations
        n: how many top observations you want
  @return: returns an object with n observations that represent those with the most prevalence
        the key is the LOINC code of the measurement and the value is a set that contains all the resource objects
**/
import $ from 'jquery'; 
export function getTopObservations(bundle, n) {
	var observations = {};
	for (var i in bundle) {
	var name = bundle[i].code.coding[0].display;
	if (observations.hasOwnProperty(name)) {
	  observations[name].push(bundle[i]);
	}
	else {
	  observations[name] = [bundle[i]];
	}
	}
	var lengths = Object.keys(observations).reduce(function(previous, current) {
		previous[current] = observations[current].length;
		return previous;
	}, {});
	var sortable = [];
	for (var length in lengths) {
	    sortable.push([length, lengths[length]]);
	}
	sortable.sort(function(a, b) {
	    return b[1] - a[1];
	});
	var topSlice = sortable.slice(0,n);
	var finalData = [];
	for(var i = 0; i < topSlice.length; i++) {
		finalData.push(observations[topSlice[i][0]]);
	}
	return finalData;
}