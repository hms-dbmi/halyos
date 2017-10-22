import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import registerServiceWorker from './services/registerServiceWorker';

import App from './components/App';
import rootReducer from './reducers';
import { history } from './services/state/state';

// Styles
import './index.css';


const preloadedState = {
  envFactorsData: {
    isFetchingPollenData: false,
  },
};

const store = createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(thunk)
);

const render = (Component, loadedStore) => {
  ReactDOM.render(
    <Provider store={loadedStore}>
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
