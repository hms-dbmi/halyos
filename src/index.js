import 'babel-polyfill'

import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import registerServiceWorker from './services/registerServiceWorker';

import Main from './Main.js'
import Header from './Header.js'

import { getURL }  from './services/smart_setup.js'

import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { history, state } from './services/state/state';

//import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { fetchAllObservations } from './services/fhir/FhirActions'
import { getPatID } from './services/smart_setup'


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

const FHIR = window.FHIR;

const FHIR_Client = FHIR.client({
  serviceUrl: getURL(),
  auth: {
        type: 'none'
  }
});

const Context_FHIR_Client = FHIR.client({
  serviceUrl: getURL(),
  patientId: getPatID(),

});


console.log("initial state: ", store.getState())

store
  .dispatch(fetchAllObservations(getPatID()))
  .then(() => console.log("we got all the data????" , store.getState()))


console.log("final state: ", store.getState())


// Initialize store
// const storeRehydrated = state.configure().store;
// window.store = storeRehydrated;

//storeRehydrated.then((store) => { window.store = store; });
//let store = createStore(todoApp);

// const Main = () => (
//   <main>
//     <Switch>
// {/*      <Route exact path='/' component={Home}/>
//       <Route path='/roster' component={Roster}/>
//       <Route path='/schedule' component={Schedule}/> */}
//     </Switch>
//   </main>
// )

// const Header = () => (
//   <header>
//     <nav>
//       <ul>
//         <li><Link to='/'>Home</Link></li>
//         <li><Link to='/roster'>Roster</Link></li>
//         <li><Link to='/schedule'>Schedule</Link></li>
//       </ul>
//     </nav>
//   </header>
// )
//console.log("firs tthing: ", window.FHIR);

// store
//   .dispatch(fetchPosts('reactjs'))
//   .then(() => console.log(store.getState()))
  
const App = () => (
    <div>
      <Header api={FHIR_Client.api} ptapi={Context_FHIR_Client.api} store={store}/>
      <Main api={FHIR_Client.api} ptapi={Context_FHIR_Client.api} store={store}/>
    </div>
)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// ReactDOM.render((
// //    <Provider store={store}>
// //      <BrowserRouter basename="/">
// <Provider store={store}>
//   <ConnectedRouter history={history}>
//     <App />
//   </ConnectedRouter>
// </Provider>   
// //      </BrowserRouter>
// //    </Provider> 
// ), document.getElementById('root'));

