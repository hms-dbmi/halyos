function getCOPD() {
	var smart = getPatID("patCOPDRisk");
	var score;
	var conditions = smart.patient.api.fetchAll({type: "Condition", query: {code: {$or: ['40917007']}}});
	var labs = smart.patient.api.fetchAll({type: "Observation", query: {code: {$or: [
           //BUN
           'http://loinc.org|6299-2',
           //BP
           'http://loinc.org|55284-4', 
           //Resp Rate
           'http://loinc.org|9279-1'
           ]}}});
	$.when(getPatient(smart), conditions, labs).done(function(patRaw, conditions, labs) {
		console.log(patRaw, conditions, labs);
		let validPatient = true;
		if (patRaw.data.total == 0) {
		  alert("This patient does not exist.");
		  validPatient = false;
		}
		else {
		  var age = calculateAge(patRaw.data.entry[0].resource.birthDate);
		}
		var confusion = pullCondition(conditions, ["40917007"]); //byCodes only works w LOINC
		labs = _.sortBy(labs, 'effectiveDateTime').reverse();
		var byCodes = smart.byCodes(labs, 'code');
    	var bunArr = byCodes("6299-2");
    	var bpArr = byCodes("55284-4");
    	var rrArr = byCodes("9279-1");
    	var bunScore = 0;
    	var bpScore = 0;
    	var rrScore = 0;
	    var scoreSets = findPriorSets({bunArr, bpArr, rrArr}, [["6299-2"], ["55284-4"], ["9279-1"]],['bun', 'bp', 'rr'], labs);
	    console.log(scoreSets);
	    if (!(scoreSets) || scoreSets.length === 0) {
	      validPatient = false;
	      alert("There are not enough measurements");
	      return;
	    }
	    score = (age >= 65) + (!(confusion.size == null)) + (scoreSets[0]['bun'].valueQuantity.value > 19)
	    + (scoreSets[0]['rr'].valueQuantity.value >= 30)
	    + ((scoreSets[0]['bp'].component[0].valueQuantity.value < 90) || (scoreSets[0]['bp'].component[1].valueQuantity.value <= 60));
	    var mortality = 'N/A';
	    switch (score) {
	      case 0:
	        mortality = 0.6;
	        break;
	      case 1:
	        mortality = 2.7;
	        break;
	      case 2:
	        mortality = 6.8;
	        break;
	      case 3:
	        mortality = 14;
	        break;
	      case 4:
	        mortality = 27.8;
	        break;
	      case 5:
	        mortality = 27.8;
	        break;
	    }
	    alert("Your pneumonia has a " + mortality + "% 30-day mortality rate.");
	});
}