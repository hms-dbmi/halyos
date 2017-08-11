
import $ from 'jquery'; 
import React from 'react';

export class SparklinesReferenceLine extends React.Component {
    constructor(props) {
    	//console.log("HERE");
        super();
    }

    render() {
        const { data } = this.props;
        //console.log(data);
        var y = this.props.y
        //console.log(this.props.y);
        return (
            <line
                x1={data[0]['date']} y1={y}
                x2={data[0]['date']} y2={y}
                />
        )
    }
}

/**@param bundle: the bundle of observations
        n: how many top observations you want
  @return: returns an object with n observations that represent those with the most prevalence
        the key is the LOINC code of the measurement and the value is a set that contains all the resource objects
**/
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
/**@param bundle: the bundle of observations
        n: how many top observations you want
  @return: returns an object with n=6 observations that represent those which have been selected for demo purposes
**/
export function getTopObservationsDemo(bundle, n=6) {
	var observations = {
		'29463-7': [], //weight
		'8480-6': [], //SysBP
		'8462-4': [], //DiasBP
		'2085-9': [], //HDL
		'18262-6': [], //LDL
		'2339-0': [] //glucose
	};
	for (var i in bundle) {
		var name = bundle[i].code.coding[0].code;
		if (observations.hasOwnProperty(name)) {
		  observations[name].push(bundle[i]);
		}
	}
	return observations;
}