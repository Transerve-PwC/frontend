// support for older browsers
import "babel-polyfill";
import "url-search-params-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import themeObject from "ui-config/themes";
import { Provider } from "react-redux";
import store from "ui-redux/store";
import "./index.css";
import App from "ui-views/App";
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme(themeObject);

// move it to a env file
window.basename =
  process.env.NODE_ENV === "production" ? "/employee-rented-properties" : "";
// hardcoded the base; to be changed soon!!!!!

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <Router basename={window.basename}>
        <App />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

