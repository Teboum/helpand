import { applyMiddleware, combineReducers, compose, createStore } from "redux";

import thunk from "redux-thunk";

import Cookie from "js-cookie";
import  loginReducer from "./Reducers/AuthReducer";

const userInfo = Cookie.getJSON("userInfo") || null;
const initState = { auth: userInfo };

const reducer = combineReducers({ auth: loginReducer });

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initState,
  composeEnhancer(applyMiddleware(thunk))
); //compose allow us to make asyn thing inside action
export default store;
