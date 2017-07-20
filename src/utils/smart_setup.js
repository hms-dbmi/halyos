//@return returns the URL of the FHIR server; allows a programmer to easily test on different server
export function getURL() {
  return 'https://sb-fhir-stu3.smarthealthit.org/smartstu3/open';
}
//@param patient ID
//@ return returns the FHIR client with the patient ID
export function getPatID(patID) {
  return '44a35c47-72b1-4e49-bb1e-518b0abedd65';
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