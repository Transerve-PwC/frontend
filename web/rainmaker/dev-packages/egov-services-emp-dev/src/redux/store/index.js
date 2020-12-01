// import rootReducer from "./reducer";
// import { createStore, applyMiddleware,combineReducers,compose } from "redux";
// import thunk from "redux-thunk";
// // import screenConfigurationMiddleware from "egov-ui-framework/ui-redux/screen-configuration/middlewares";
// import logger from 'redux-logger';

//  let middlewares = [];

// middlewares = middlewares.concat(thunk);

// if (process.env.NODE_ENV === "development") {
//   const { logger } = require("redux-logger");
//   middlewares = middlewares.concat(logger);
// }


// const store = createStore(combineReducers({
//   ...rootReducer
// }),compose(
//    applyMiddleware(...middlewares, logger, thunk),
//    window.devToolsExtension ? window.devToolsExtension() : f => f
//  ))


// export default store


import rootReducer from "./reducer";
import thunk from "redux-thunk";
import formMiddleware from "egov-ui-kit/redux/form/middlewares";
import authMiddleware from "egov-ui-kit/redux/auth/middleware";
import appMiddleware from "egov-ui-kit/redux/app/middleware";
import screenConfigurationMiddleware from "egov-ui-framework/ui-redux/screen-configuration/middlewares";


let middlewares = [];

middlewares = middlewares.concat(authMiddleware);
middlewares = middlewares.concat(formMiddleware);
middlewares = middlewares.concat(appMiddleware);
middlewares = middlewares.concat(screenConfigurationMiddleware);
middlewares = middlewares.concat(thunk);

if (process.env.NODE_ENV === "development") {
  const { logger } = require("redux-logger");
  middlewares = middlewares.concat(logger);
}

export default { rootReducer, middlewares }
