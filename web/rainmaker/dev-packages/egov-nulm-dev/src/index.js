import "babel-polyfill";
import "url-search-params-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
// import themeObject from "ui-config/themes";
import { Provider } from "react-redux";
import store from "ui-redux/store";
import "./index.css";
import Routes from './ui-config/routes//routes'
 import App from "ui-views/App";
import registerServiceWorker from "./registerServiceWorker";

//const theme = createMuiTheme(themeObject);

// move it to a env file
window.basename =
  process.env.NODE_ENV === "production" ? "/opms" : "";
// hardcoded the base; to be changed soon!!!!!

ReactDOM.render(
  <MuiThemeProvider >
    <Provider store={store}>
      <Router basename={window.basename}>
        {/* <Routes /> */}
        <App />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
// registerServiceWorker();
