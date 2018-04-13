import React from 'react';

// Components
import Main from './Main';
import TopbarContainer from './TopbarContainer';

// Other stuff
import { getPatID, getURL } from '../services/smart_setup';

// Could go into a utility function
const getClientApi = fhir => fhir.client({
  serviceUrl: getURL(),
  auth: { type: 'none' },
}).api;

// Could go into a utility function
const getClientContextApi = fhir => fhir.client({
  serviceUrl: getURL(),
  patientId: getPatID(),
}).api;

const App = props => (
  <div className="app full-dim">
    <TopbarContainer
      api={getClientApi(props.fhir)}
      ptapi={getClientContextApi(props.fhir)}
    />
    <Main
      api={getClientApi(props.fhir)}
      ptapi={getClientContextApi(props.fhir)}
    />
  </div>
);

export default App;
