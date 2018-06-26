import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux'; 
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import appReducer from './app/reducers';   
import AppContainer from './app/containers/AppContainer';

// middleware that logs actions
const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__  });

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware, // lets us dispatch() functions
      loggerMiddleware,
    ),
  );
  return createStore(appReducer, initialState, enhancer);
}

const store = configureStore({});  

const App = () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
)

export default App;
