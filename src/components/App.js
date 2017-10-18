import React from 'react';

// Components
import Main from './Main.js';
import Topbar from './Topbar.js';

// Other stuff
import { getPatID, getURL } from '../services/smart_setup';

// Styles
import './App.css';

// Could go into a utility function
const getClientApi = fhir => fhir.client({
  serviceUrl: getURL(),
  auth: { type: 'none' }
}).api;

// Could go into a utility function
const getClientContextApi = fhir => fhir.client({
  serviceUrl: getURL(),
  patientId: getPatID()
}).api;

const App = props => (
  <div class="app">
    <Topbar api={getClientApi(props.fhir)} ptapi={getClientContextApi(props.fhir)} />
    <Main api={getClientApi(props.fhir)} ptapi={getClientContextApi(props.fhir)} />
  </div>
);

export default App;
