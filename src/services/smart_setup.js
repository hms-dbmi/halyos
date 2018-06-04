//@return returns the URL of the FHIR server; allows a programmer to easily test on different server
export function getURL() {
  return 'https://fhirtest.uhn.ca/baseDdstu3';
  // return 'http://hapi.fhir.org/baseDstu3';
}

export function getInsecureURL() {
  return 'http://fhirtest.uhn.ca/baseDsstu3';
}
//@param patient ID
//@ return returns the FHIR client with the patient ID
export function getPatID(patID) {
  return '240225'; 
  //patient info id (another one): 1c6299f7-2d06-4b5d-9efb-a8216a405a92
  //182296 (healthy), 
  //189211 (sick)
  // patientID = document.getElementById(patID).value;
  // var demo = {
  //   serviceUrl: "http://fhirtest.uhn.ca/baseDstu3",
  //   patientId: patientId
  // }
  // return FHIR.client({
  //     serviceUrl: getURL(),
  //     patientId: patientID
  // });
}
