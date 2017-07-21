function CKDtoKF() { //add units check
  var smart = getPatID("patIDKF");
  var score;
  var labs = smart.patient.api.fetchAll({type: "Observation", query: {code: {$or: ['http://loinc.org|48643-1',
           'http://loinc.org|48642-3', 'http://loinc.org|33914-3',
           'http://loinc.org|14958-3', 'http://loinc.org|14959-1']}}});
  $.when(getPatient(smart), labs).done(function(patRaw, labs) {
    let validPatient = true;
    if (patRaw.data.total == 0) {
      alert("This patient does not exist.");
      validPatient = false;
    }
    else {
      var age = calculateAge(patRaw.data.entry[0].resource.birthDate);
      var gender = patRaw.data.entry[0].resource.gender;
      if (gender == "male") {gender = 1;}
      else if (gender == "female") {gender = 0;}
      else {alert("Patient has no gender.");}
    }
    labs = _.sortBy(labs, 'effectiveDateTime').reverse();
    var byCodes = smart.byCodes(labs, 'code');
    var GFRArr = byCodes("48643-1", "48642-3", "33914-3");
    var UACArr = byCodes("14958-3", "14959-1");
    var scoreSets = findPriorSets({GFRArr, UACArr},
      [["48643-1", "48642-3", "33914-3"], ["14958-3", "14959-1"]],
      ['gfr', 'uac'], labs);
    console.log(GFRArr);
    console.log(UACArr);
    if (scoreSets.length === 0) {
      validPatient = false;
    }
    if(validPatient) {
      for (var i = 0; i < scoreSets.length; i++) {
        let a = 0.2694*gender-0.2167*age/10-0.55418*scoreSets[i]['gfr'].valueQuantity.value/5+
        0.45608*Math.log(scoreSets[i]['uac'].valueQuantity.value);
        score = 100*(1-Math.pow(0.924, Math.pow(Math.E, a+2.96774)));
        score = score.toFixed(2);
        let sum = 0;
        let counter = 0;
        let tempTime;
        let maxTime = 0;
        for(variable in scoreSets[i]) {
          tempTime = new Date(scoreSets[i][variable].effectiveDateTime);
          sum += tempTime.getTime();
          if (tempTime > maxTime) {
            maxTime = tempTime;
          }
          counter++;
        }
        avgDate = new Date(sum/counter)
        console.log("As of " + new Date(maxTime) + "the probability your CKD would have resulted in kidney failure in the next five years was " + score + "%.");
        //alert("As of " + new Date(maxTime) + "the probability your CKD would have resulted in kidney failure in the next five years was " + score + "%.");
      }
    }
    else {
      alert("This patient is missing measurements that are necessary to making the prediction.");
    }
  });
}