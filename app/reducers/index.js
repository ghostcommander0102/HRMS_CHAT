import { combineReducers } from "redux";
import AuthReducer from "./auth";
import AppReducer from "./app";

export default combineReducers({
  auth: AuthReducer,
  app: AppReducer
});
