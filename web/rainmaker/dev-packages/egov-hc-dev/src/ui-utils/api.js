import axios from "axios";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { addQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getAccessToken, getapplicationNumber, getLocale, getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import store from "../ui-redux/store";

const instance = axios.create({
  baseURL: window.location.origin,
  
  headers: {
    "Content-Type": "application/json",
    "X-Content-Type-Options":"nosniff"
  }
});

const wrapRequestBody = (requestBody, action, customRequestInfo) => {
  // var d = new Date();
  var Time = Date.now();
  // getEpochForDate(Ti)
 
  let applicationnumber = getapplicationNumber();
  let RequestInfo = {
    apiId: "Rainmaker",
    ver: ".01",
    ts: 0,
    action: action,
    did: "1",
    key: "",
    msgId: `20170310130900|${getLocale()}`,
    authToken: getAccessToken(),
    //requesterId: "",
    correlationId: "",
    userInfo: JSON.parse(getUserInfo()), // For live purpose

  };
  let ExtraPayload = {

    tenantId: getTenantId(),

    auditDetails: {
      createdBy: JSON.parse(getUserInfo()).id,
      lastModifiedBy: JSON.parse(getUserInfo()).id,
      createdTime: Time,
      lastModifiedTime: Time
    }
  }
  return Object.assign(
    {},
    {
      RequestInfo,
      ...ExtraPayload,
      ...customRequestInfo,
      ...requestBody
    },

  );
};

export const httpRequest = async (
  method = "get",
  endPoint,
  action,
  queryObject = [],
  requestBody = {},
  headers = {
    "Content-Type": "application/json",
    "X-Content-Type-Options":"nosniff"
  },
  customRequestInfo = {}
) => {
  store.dispatch(toggleSpinner());
  let apiError = "Api Error";

  if (headers)
    instance.defaults = Object.assign(instance.defaults, {
      headers
    });

  endPoint = addQueryArg(endPoint, queryObject);
  var response;
  try {
    // response["X-Powered-By"] = "Express"
    switch (method) {
      case "post":
        response = await instance.post(
          endPoint,
          wrapRequestBody(requestBody, action, customRequestInfo)
        );
        
        break;
      default:
        response = await instance.get(endPoint);
    }
    const responseStatus = parseInt(response.status, 10);
    store.dispatch(toggleSpinner());
    if (responseStatus === 200 || responseStatus === 201) {
      return response.data;
    }
    // response.set('X-Powered-By',false);
    // response.set({"X-Frame-Options": "SAMEORIGIN"});
  } catch (error) {
    const { data, status } = error.response;
    if (status === 400 && data === "") {
      apiError = "INVALID_TOKEN";
    } else {
      apiError =
        (data.hasOwnProperty("Errors") &&
          data.Errors &&
          data.Errors.length &&
          data.Errors[0].message) ||
        (data.hasOwnProperty("error") &&
          data.error.fields &&
          data.error.fields.length &&
          data.error.fields[0].message) ||
        (data.hasOwnProperty("error_description") && data.error_description) ||
        apiError;
    }
    store.dispatch(toggleSpinner());
  }
  // unhandled error
  throw new Error(apiError);
};

export const loginRequest = async (username = null, password = null) => {
  let apiError = "Api Error";
  try {
    // api call for login
    //alert("Logged in");
    return;
  } catch (e) {
    apiError = e.message;
  }

  throw new Error(apiError);
};

export const logoutRequest = async () => {
  let apiError = "Api Error";
  try {
    //alert("Logged out");
    return;
  } catch (e) {
    apiError = e.message;
    // //alert(e.message);
  }

  throw new Error(apiError);
};
