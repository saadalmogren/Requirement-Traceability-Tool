import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import authReducer from "./store/reducers/auth";
import modifyInfoReducer from "./store/reducers/modifyAccountInfo";
import axios from "axios";
import projectReducer from "./store/reducers/projectReducer";
import projectDetailsReducer from "./store/reducers/projectDetails";
import usersReducer from "./store/reducers/Users";
import rolesReducer from "./store/reducers/roles";
import modifyRoleReducer from "./store/reducers/modifyRole";
import changeUserRoleReducer from "./store/reducers/changeUserRole";
import artifactTypesReducer from "./store/reducers/artifactTypes";
import artifactsReducer from "./store/reducers/artifacts";
import traceabilityLinkTypesReducer from "./store/reducers/traceabilityLinkTypes";
import traceabilityLinksReducer from "./store/reducers/traceabilityLinks";
import artifactChangeRequestsReducer from "./store/reducers/artifactChangeRequests";
import traceabilityLinkChangeRequestsReducer from "./store/reducers/traceabilityLinkChangeRequests";
import myArtifactChangeRequestsReducer from "./store/reducers/myArtifactChangeRequests";
import myTraceabilityLinkChangeRequestsReducer from "./store/reducers/myTraceabilityLinkChangeRequests";
import notificationsReducer from "./store/reducers/notifications";
import alertReducer from "./store/reducers/alert";

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  modifyInfo: modifyInfoReducer,
  projects: projectReducer,
  projectDetails: projectDetailsReducer,
  users: usersReducer,
  roles: rolesReducer,
  modifyRole: modifyRoleReducer,
  changeUserRole: changeUserRoleReducer,
  artifactTypes: artifactTypesReducer,
  artifacts: artifactsReducer,
  traceabilityLinkTypes: traceabilityLinkTypesReducer,
  traceabilityLinks: traceabilityLinksReducer,
  artifactChangeRequests: artifactChangeRequestsReducer,
  myArtifactChangeRequests: myArtifactChangeRequestsReducer,
  traceabilityLinkChangeRequests: traceabilityLinkChangeRequestsReducer,
  myTraceabilityLinkChangeRequests: myTraceabilityLinkChangeRequestsReducer,
  notifications: notificationsReducer,
});

const persistedState = localStorage.getItem("reduxState")
  ? JSON.parse(localStorage.getItem("reduxState"))
  : {};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunk))
);

store.subscribe(() => {
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

// don't forget to change SocketIOHandler endPoint address!
axios.defaults.baseURL = "http://127.0.0.1:5000";

// SocketIOHandler();
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
