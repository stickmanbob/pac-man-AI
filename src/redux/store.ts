import { createStore } from 'redux';
import reducers from './reducers';


// Redux Logger (optional dev middleware)
// import { applyMiddleware } from 'redux';
// import logger from "redux-logger"; 
  
export default createStore(reducers);