export function getURL() {
  return 'http://fhirtest.uhn.ca/baseDstu3';
}

export function getPatID(patID) {
  return 59859;
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