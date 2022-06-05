import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxTunk from "redux-thunk";

import Reducer from "./_reducers/index";

const rootNode = document.getElementById('root');

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxTunk)(createStore)

ReactDOM.createRoot(rootNode).render(
  <Provider
    store={createStoreWithMiddleware(Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
  >
    <App />
  </Provider>
)

reportWebVitals();