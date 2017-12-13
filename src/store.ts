import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';

const epicMiddleware = createEpicMiddleware();
const middleware = [epicMiddleware];

if (DEBUG) {
  const { createLogger } = require('redux-logger');
  const logger = createLogger({
    level: 'info'
  });
  middleware.push(logger);
}

const reducer = combineReducers({});

let store;
if (!(window.hasOwnProperty('__REDUX_DEVTOOLS_EXTENSION__'))) {
  store = createStore(
    reducer,
    applyMiddleware(...middleware),
  );
} else {
  store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middleware)),
  );
}

export default store;
