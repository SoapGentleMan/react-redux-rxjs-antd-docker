import * as React from 'react';
import store from './store';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

export const App = () => (
  <Provider store={store}>
    <Router>
      <Route path="/" component={}/>
    </Router>
  </Provider>
);
