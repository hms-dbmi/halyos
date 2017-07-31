//@return returns the URL of the FHIR server; allows a programmer to easily test on different server
export function getURL() {
  return 'http://fhirtest.uhn.ca/baseDstu3';
}
//@param patient ID
//@ return returns the FHIR client with the patient ID
export function getPatID(patID) {
  return '189211'; //182296 (healthy-ish), 189211 (sick)
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