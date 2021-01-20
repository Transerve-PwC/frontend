import rootReducer from "./reducer";
import { createStore, applyMiddleware,combineReducers,compose } from "redux";
import thunk from "redux-thunk";
// import screenConfigurationMiddleware from "egov-ui-framework/ui-redux/screen-configuration/middlewares";
// import authMiddleware from "egov-ui-framework/ui-redux/auth/middlewares";
import logger from 'redux-logger';

let middlewares = [];

// middlewares = middlewares.concat(authMiddleware);
// middlewares = middlewares.concat(screenConfigurationMiddleware);
middlewares = middlewares.concat(thunk);

if (process.env.NODE_ENV === "development") {
  const { logger } = require("redux-logger");
  middlewares = middlewares.concat(logger);
}

const store = createStore(combineReducers({
  ...rootReducer
}),compose(
   applyMiddleware(...middlewares, logger, thunk),
   window.devToolsExtension ? window.devToolsExtension() : f => f
 ))

export default store
