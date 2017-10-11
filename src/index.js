import 'babel-polyfill'

import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import registerServiceWorker from './services/registerServiceWorker';

import App from './components/App';

import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { history, state } from './services/state/state';

//import { Provider } from 'react-redux'
import { createStore } from 'redux';
import rootReducer from './reducers';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { fetchAllObservations } from './services/fhir/FhirActions';
import { getPatID } from './services/smart_setup';


const preloadedState = {
  envFactorsData: {
    isFetchingPollenData: false,
  },
}

export const store = createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(thunk)
);

store
  .dispatch(fetchAllObservations(getPatID()))
  .then(() => console.log("we got all the data????" , store.getState()));

const render = (Component, store, error) => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Component fhir={window.FHIR} />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  );
};

render(App, store);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    render(NextApp, store);
  });
  window.store = store;
}

registerServiceWorker();
