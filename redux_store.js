{
  selectedMeasurementCode: '2980-6',
  selectedRiskScore: 'Cardiac',

  //the IDs can be snomed or loinc codes
  most_recent_measurements: {
  	id : {
  		value: 5,
  		units: "",
  		reference_range: [],
  	}
  },

  //this will be a fetchall of all observations
  allObservations : {
  	isFetching: true,
  	didInvalidate: false,
  	items: []
  }, 
  allConditions : {
	isFetching: true,
  	didInvalidate: false,
  	items: []
  },
  riskScores : {
  	cardiac: 5.3,
  	stroke: 2.5,
  },
  demographics: {
  	first_name: "",
  	last_name: "",
	DOB: "",
  	last_visit: "",
  	sex: "",
  	last_visit: "",
  },
  environment: {
  	aiq: {
	  isFetching: true,
	  didInvalidate: false,
	  items: []
	},
	pollen: {
	  isFetching: true,
	  didInvalidate: false,
	  items: []
	},
	flu: {
	  isFetching: true,
	  didInvalidate: false,
	  items: []
	}
  },
  medicationsByID : {
  	id : {
  		common_name: "",
  		dosage: "",
  	}
  },
  medications : array<id>,
  preventative: array<id>,
  preventativeByID : {
  	id : {
  		text : "",
  		main_component : "",
  		deadline: "", 
  	}
  },
  
}