import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import freeze from 'redux-freeze';
import { createLogger } from 'redux-logger';
import { autoRehydrate, persistStore, purgeStoredState } from 'redux-persist';
import thunk from 'redux-thunk';

// Reducer
import rootReducer from '../../reducers';

const config = {
  debounce: 25,
};

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

  const store = createStore(
    enableBatching(rootReducer),
    initialState,
    compose(...middleware)
  );

  return store;
};

class State {
  configure(initialState) {
    this.store = configure(initialState);
    return this;
  }
}

const state = new State();

export {
  configure,
  history,
  state,
};
