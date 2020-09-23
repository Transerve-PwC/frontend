import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Toast } from "components";
import { addBodyClass } from "egov-ui-kit/utils/commons";
import { fetchCurrentLocation, fetchLocalizationLabel, toggleSnackbarAndSetText, setRoute, setPreviousRoute } from "egov-ui-kit/redux/app/actions";
import { fetchMDMSData } from "egov-ui-kit/redux/common/actions";
import { logout } from "egov-ui-kit/redux/auth/actions";
import Router from "./Router";
import commonConfig from "config/common";
import redirectionLink from "egov-ui-kit/config/smsRedirectionLinks";
import routes from "./Routes";
import { LoadingIndicator } from "components";
import { getLocale , setDefaultLocale, getDefaultLocale } from "egov-ui-kit/utils/localStorageUtils";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { getQueryArg } from "egov-ui-kit/utils/commons";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get"

class App extends Component {
  constructor(props) {
    super(props);
    const { pathname: currentPath } = props.location;

    props.history.listen((location, action) => {
      const { pathname: nextPath } = location;
      addBodyClass(nextPath);
      props.toggleSnackbarAndSetText(false, { labelName: "", labelKey: "" }, "success");
    });
    addBodyClass(currentPath);
  }

  componentDidMount = async () => {
    const { fetchLocalizationLabel, fetchCurrentLocation, fetchMDMSData } = this.props;
    const { pathname } = window.location;
    let requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "Department",
              },
              {
                name: "Designation",
              },
              {
                name: "StateInfo",
              },
            ],
          },
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants",
              },
              {
                name: "citymodule",
              },
              {
                name: "tenantInfo",
              },
            ],
          },
        ],
      },
    };
    // can be combined into one mdms call
      setDefaultLocale(getDefaultLocale());
      const urlPath = window.location.pathname;
    if(pathname.includes("/user/otp") || pathname.includes("/user/login") || pathname.includes("/user/register")|| pathname.includes("/language-selection") )
   fetchLocalizationLabel(getLocale() || "en_IN");
    // current location
    fetchCurrentLocation();
    fetchMDMSData(requestBody);
    pathname.indexOf("/otpLogin") > -1 && this.handleSMSLinks();
  };

  handleSMSLinks = () => {
    const { authenticated, setPreviousRoute, setRoute, userInfo,logout } = this.props;
    const { href } = window.location;
    const mobileNumber = getQueryArg(href,"mobileNo");
    const citizenMobileNo = get(userInfo, "mobileNumber");

    if(authenticated){
      if(mobileNumber === citizenMobileNo){
        setRoute(redirectionLink(href));
      }else{
        logout()
        setRoute("/user/otp?smsLink=true");
       // setPreviousRoute(redirectionLink(href));
      } 
    }else{
      setRoute("/user/otp?smsLink=true");
      setPreviousRoute(redirectionLink(href));
    }
    // if (!authenticated) {
    //   setRoute("/user/otp?smsLink=true");
    //   setPreviousRoute(redirectionLink(href));
    // } else {
    //   setRoute(redirectionLink(href));
    // }
  };

  componentWillReceiveProps(nextProps) {
    const { route: nextRoute, authenticated, location } = nextProps;
    const { route: currentRoute, history, setRoute } = this.props;
    if (nextRoute && currentRoute !== nextRoute) {
      history.push(nextRoute);
      setRoute("");
    }
    const isWithoutAuthSelfRedirect = location && location.pathname && location.pathname.includes("openlink");
    const isPrivacyPolicy = location && location.pathname && location.pathname.includes("privacy-policy");

    if (nextProps.hasLocalisation !== this.props.hasLocalisation && !authenticated && !getQueryArg("", "smsLink") && !isWithoutAuthSelfRedirect && !isPrivacyPolicy) {
      if(nextProps.hasLocalisation){
        if(window.location.search.includes("mobileno") && window.location.search.includes("ecno"))
        {       
             setDefaultLocale("en_IN");
        }
        if(getDefaultLocale()== "null")
          this.props.history.replace("/language-selection");
      }
    }
  }

  render() {
    const { toast, loading, defaultUrl, hasLocalisation } = this.props;
    return (
      <div>
        <Router routes={routes} hasLocalisation={hasLocalisation} defaultUrl={defaultUrl} />
        {toast && toast.open && !isEmpty(toast.message) && <Toast open={toast.open} message={toast.message} variant={toast.variant} />}
        {loading && <LoadingIndicator />}
      </div>
    );
  }
}
function QueryStringToJSON() {            
  var pairs = window.location.search.slice(1).split('&');
  
  var result = {};
  pairs.forEach(function(pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
  });

  return JSON.parse(JSON.stringify(result));
}



const mapStateToProps = (state, ownProps) => {
  const { app, auth, common } = state;
  const { authenticated,userInfo,token } = auth || false;
  const { route, toast } = app;
  const { spinner } = common;
  const { stateInfoById } = common || [];
  let hasLocalisation = false;
  let defaultUrl = process.env.REACT_APP_NAME === "Citizen" ? "/user/register" : "/user/login";
  if (stateInfoById && stateInfoById.length > 0) {
    hasLocalisation = stateInfoById[0].hasLocalisation;
    defaultUrl = stateInfoById[0].defaultUrl;
  }
 if(window.location.pathname.includes("/") || window.location.pathname.includes("/user/login") ||  window.location.pathname.includes("/user/register")){
  
    defaultUrl = "/citizen/user/login";
   
 }
 if(window.location.pathname.includes("/user/login")){
 
 if(window.location.search){
  var queryString = QueryStringToJSON();
  if(queryString.mobileno){
    defaultUrl = "/citizen/user/otp"
    window.location.href=`/citizen/user/otp${window.location.search}`
  }
  else{
    defaultUrl = "/citizen/user/login";
  }
 }
} 
  const props = {};
  const loading = ownProps.loading || spinner;
  if (route && route.length) {
    props.route = route;
  }
  if (toast && toast.open && toast.message && !isEmpty(toast.message)) {
    props.toast = toast;
  }
  return {
    ...props,
    loading,
    hasLocalisation,
    defaultUrl,
    authenticated,
    userInfo,
    token
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocalizationLabel: (locale) => dispatch(fetchLocalizationLabel(locale)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
    fetchMDMSData: (criteria) => dispatch(fetchMDMSData(criteria)),
    fetchCurrentLocation: () => dispatch(fetchCurrentLocation()),
    setRoute: (route) => dispatch(setRoute(route)),
    setPreviousRoute: (route) => dispatch(setPreviousRoute(route)),
    logout: () => dispatch(logout())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
