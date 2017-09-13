import createHistory from 'history/createBrowserHistory';
import localforage from 'localforage';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import freeze from 'redux-freeze';
import { createLogger } from 'redux-logger';
import { autoRehydrate, persistStore, purgeStoredState } from 'redux-persist';
import thunk from 'redux-thunk';

// Reducer
import rootReducer from '../../reducers';


// Utils
import MultiStorage from './multi-storage';

const primStorage = localforage;

const config = {
  debounce: 25,
};

const api = {
  getAllKeys(cb) {
    return primStorage.getAllKeys(cb);
  },
  getItem(key, cb) {
    return primStorage.getItem(key, cb);
  },
  setItem(key, string, cb) {
   return primStorage.setItem(key, string, cb);

     //primStorage.setItem(key, string, cb);
  },
  removeItem(key, cb) {
   return primStorage.removeItem(key, cb);

     //primStorage.removeItem(key, cb);
  },
};

primStorage.api = api;

const history = createHistory();

const middleware = [
  autoRehydrate(),
  applyMiddleware(thunk),
  applyMiddleware(routerMiddleware(history)),
];

if (process.env.NODE_ENV === 'development') {
  // Configure the logger middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });

  middleware.push(applyMiddleware(freeze));
  middleware.push(applyMiddleware(logger));
}

const configure = (initialState) => {

  //with undo functionality (don't need for ignite)
  // const store = createStore(
  //   undoable(enableBatching(rootReducer), {
  //     groupBy: groupByActionTypes([
  //       setViewConfig().type,
  //       setViewerMouseTool().type,
  //       setViewerRightBarShow().type,
  //       setViewerRightBarWidth().type,
  //     ]),
  //     limit: 20,
  //   }),
  //   initialState,
  //   compose(...middleware)
  // );

  const store = createStore(
    enableBatching(rootReducer),
    initialState,
    compose(...middleware)
  );


  // // Snippet to allow hot reload to work with reducers
  // if (module.hot) {
  //   module.hot.accept(() => {
  //     store.replaceReducer(rootReducer);
  //   });
  // }


  //1. this doesn't make sense
  // return prepareStore.then((storage) => {
  //   config.storage = storage;

  //   return new Promise((resolve, reject) => {
  //     persistStore(store, config, (error) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         resolve(store);
  //       }
  //     });
  //   });
  // });

  return store;
};

class State {
  configure(initialState) {
    this.store = configure(initialState);
    return this;
  }
}

const state = new State();

console.log("configure: ", configure, "      history      " , history, "               state     " , state);

export {
  configure,
  history,
  state,
};
