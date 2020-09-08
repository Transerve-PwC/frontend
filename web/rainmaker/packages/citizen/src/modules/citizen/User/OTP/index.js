import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { Banner } from "modules/common";
import OTPForm from "./components/OTPForm";
import { handleFieldChange, submitForm, setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { sendOTP } from "egov-ui-kit/redux/auth/actions";
import { Screen } from "modules/common";
import { httpRequest } from "egov-ui-kit/utils/api";
import commonConfig from "config/common";
import { getQueryArg } from "egov-ui-kit/utils/commons";
import get from "lodash/get";
import { localStorageSet,getAccessToken,clearUserDetails } from "egov-ui-kit/utils/localStorageUtils";
import { startSMSRecevier } from "egov-ui-kit/utils/commons";
import {  toggleSnackbarAndSetText, setRoute } from "egov-ui-kit/redux/app/actions";
import { logout } from "egov-ui-kit/redux/auth/actions";
import { AUTH} from "egov-ui-kit/utils/endPoints";

const OTPFormHOC = formHoc({ formKey: "otp" })(OTPForm);

class OTP extends Component {
  state = {otpRedirect : false}
  componentWillMount() {
    const { previousRoute } = this.props;
   // commented out as it was redirecting
    // if (previousRoute.length === 0) {
    //   this.props.history.push("/user/register");
    // }

    if(!this.state.otpRedirect){
      this.directOTPgeneration();
      this.setState({otpRedirect:true})
    }
   
    
  }
   QueryStringToJSON = () => {            
    var pairs = window.location.search.slice(1).split('&');
    
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
  
    return JSON.parse(JSON.stringify(result));
  }


    redirectToEChallan = async (queryString) => {
      const { phoneNumber, setFieldProperty,toggleSnackbarAndSetText,setRoute,authenticated } = this.props;
      try{  
             const response =  await httpRequest(`/user-otp/v1/_send`, "_send", [], {
                            otp: { mobileNumber: queryString.mobileno, type: "login", tenantId: commonConfig.tenantId ,userType: "CITIZEN"},
                          });
          if(response){
            startSMSRecevier();
          //  setRoute(`/user/otp?mobileno=${queryString.mobileno}&ecno=${queryString.ecno}`)
            setFieldProperty("otp", "otp", "phone", queryString.mobileno);
            window.localStorage.setItem("ecno",queryString.ecno); 
          }  
              
      }
      catch(err){
          toggleSnackbarAndSetText(true, { labelName: "", labelKey: "User not Found With this UserName" }, "error");
          setTimeout(function(){  setRoute("/user/login") }, 1000);;
      }
    }

  directOTPgeneration = async () => {
      const { authenticated,logout } = this.props;
      var queryString = this.QueryStringToJSON();
      if(queryString.mobileno){
      if(authenticated){
        const authToken = getAccessToken();
        if (authToken) {
          // const response = await httpRequest(AUTH.LOGOUT.URL, AUTH.LOGOUT.ACTION, [{ key: "access_token", value: authToken }]);
          // clearUserDetails();
          logout();
        // if(response)
          {
            this.redirectToEChallan(queryString);
          }
        }
      }else{     
          this.redirectToEChallan(queryString);
        }
      } 
  }

  sendOtpForAutoLogin = async () => {
    const { phoneNumber, setFieldProperty } = this.props;
    if (phoneNumber) {
      await httpRequest(`/user-otp/v1/_send`, "_send", [], {
        otp: { mobileNumber: phoneNumber, type: "login", tenantId: commonConfig.tenantId },
      });
      setFieldProperty("otp", "otp", "phone", phoneNumber);
    }
  };

  componentDidMount() {
    const { submitForm, handleFieldChange, previousRoute } = this.props;
    const otpElement = document.getElementById("otp");
    const userAgent = window.navigator.userAgent;
    if(window.mSewaApp){
      localStorageSet("isNative", true);
    }else{
      localStorageSet("isNative", false);
    }

    if (/Android/.test(userAgent)) {
      localStorageSet("isNative", true);
    } else  {
      localStorageSet("isNative", false);
    }


    otpElement.addEventListener("smsReceived", (e) => {
      // localStorageSet("isNative", true);
      const { otp } = e.detail;
      handleFieldChange("otp", "otp", otp);
      if (previousRoute === "/citizen/user/register") {
        submitForm("otp", "/user/citizen/_create");
      } else {
        submitForm("otp");
      }
    });
    getQueryArg("", "smsLink") && this.sendOtpForAutoLogin();
  }

  componentWillUnmount() {
    const otpElement = document.getElementById("otp");
    otpElement.removeEventListener("smsReceived", null);
  }

  resendOTP = () => {
    const { sendOTP, intent } = this.props;
    if (intent) sendOTP(intent);
    else if (getQueryArg("", "smsLink")) this.sendOtpForAutoLogin();
  };

  render() {
    const { phoneNumber, loading, bannerUrl, logoUrl } = this.props;
    const { resendOTP } = this;

    return (
      <Screen loading={loading} className="force-padding-0">
        <Banner bannerUrl={bannerUrl} logoUrl={logoUrl}>
          <OTPFormHOC resendOTP={resendOTP} phoneNumber={phoneNumber} logoUrl={logoUrl} />
        </Banner>
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const { authenticating,authenticated } = state.auth;
  const { previousRoute } = state.app;
  const { stateInfoById } = state.common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  const intent = previousRoute.endsWith("register") ? "register" : previousRoute.endsWith("login") ? "login" : null;
  let phoneNumber = null;
  if (intent) {
    phoneNumber = state.form[intent].fields.phone.value;
  }
  else if (getQueryArg(previousRoute, "mobileno")){
    phoneNumber=getQueryArg(previousRoute, "mobileno");
  }
  if (phoneNumber === null && getQueryArg("", "smsLink")) phoneNumber = getQueryArg(previousRoute, "mobileNo");
  return { previousRoute, intent, phoneNumber, loading: authenticating, bannerUrl, logoUrl,authenticated };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
    submitForm: (formKey, saveUrl) => dispatch(submitForm(formKey, saveUrl)),
    sendOTP: (otp) => dispatch(sendOTP(otp)),
    setFieldProperty: (formKey, fieldKey, propertyName, propertyValue) => dispatch(setFieldProperty(formKey, fieldKey, propertyName, propertyValue)),
    setRoute: (route) => dispatch(setRoute(route)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    logout: () => dispatch(logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OTP);
