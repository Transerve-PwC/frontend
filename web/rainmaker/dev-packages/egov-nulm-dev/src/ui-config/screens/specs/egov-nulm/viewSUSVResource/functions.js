import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  createEmployee,
  getSearchResults,
  updateEmployee
} from "../../../../../ui-utils/commons";
import {
  convertDateToEpoch,
  epochToYmdDate,
  showHideAdhocPopup,
  validateFields
} from "../../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  handleCardDelete } from "../../../../../ui-utils/commons";
import{httpRequest} from '../../../../../ui-utils/api'
// SET ALL SIMPLE DATES IN YMD FORMAT
const setDateInYmdFormat = (obj, values) => {
  values.forEach(element => {
    set(obj, element, epochToYmdDate(get(obj, element)));
  });
};

// SET ALL MULTIPLE OBJECT DATES IN YMD FORMAT
const setAllDatesInYmdFormat = (obj, values) => {
  values.forEach(element => {
    let elemObject =
      get(obj, `${element.object}`, []) === null
        ? []
        : get(obj, `${element.object}`, []);
    for (let i = 0; i < elemObject.length; i++) {
      element.values.forEach(item => {
        set(
          obj,
          `${element.object}[${i}].${item}`,
          epochToYmdDate(get(obj, `${element.object}[${i}].${item}`))
        );
      });
    }
  });
};

// SET ALL MULTIPLE OBJECT EPOCH DATES YEARS
const setAllYears = (obj, values) => {
  values.forEach(element => {
    let elemObject =
      get(obj, `${element.object}`, []) === null
        ? []
        : get(obj, `${element.object}`, []);
    for (let i = 0; i < elemObject.length; i++) {
      element.values.forEach(item => {
        let ymd = epochToYmdDate(get(obj, `${element.object}[${i}].${item}`));
        let year = ymd ? ymd.substring(0, 4) : null;
        year && set(obj, `${element.object}[${i}].${item}`, year);
      });
    }
  });
};

const setRolesData = obj => {
  let roles = get(obj, "user.roles", []);
  let newRolesArray = [];
  roles.forEach(element => {
    newRolesArray.push({
      label: element.name,
      value: element.code
    });
  });
  set(obj, "user.roles", newRolesArray);
};

const returnEmptyArrayIfNull = value => {
  if (value === null || value === undefined) {
    return [];
  } else {
    return value;
  }
};

export const setRolesList = (state, dispatch) => {
  let rolesList = get(
    state.screenConfiguration.preparedFinalObject,
    `Employee[0].user.roles`,
    []
  );
  let furnishedRolesList = rolesList.map(item => {
    return " " + item.label;
  });
  dispatch(
    prepareFinalObject(
      "hrms.reviewScreen.furnishedRolesList",
      furnishedRolesList.join()
    )
  );
};



// Remove objects from Arrays not having the specified key (eg. "id")
// and add the key-value isActive:false in those objects having the key
// so as to deactivate them after the API call
const handleDeletedCards = (jsonObject, jsonPath, key) => {
  let originalArray = get(jsonObject, jsonPath, []);
  let modifiedArray = originalArray.filter(element => {
    return element.hasOwnProperty(key) || !element.hasOwnProperty("isDeleted");
  });
  modifiedArray = modifiedArray.map(element => {
    if (element.hasOwnProperty("isDeleted")) {
      element["isActive"] = false;
    }
    return element;
  });
  set(jsonObject, jsonPath, modifiedArray);
};

export const handleSubmitSMID = (state, dispatch) =>{
  handleCreateUpdateSMID(state, dispatch,"Created")
};
export const handlesaveSMID = (state, dispatch) =>{
  handleCreateUpdateSMID(state, dispatch,"Drafted")
};
export const handleRejectSMID = (state, dispatch) =>{
  handleCreateUpdateSMID(state, dispatch,"Rejected")
};
export const handleApproveSMID = (state, dispatch) =>{
  handleCreateUpdateSMID(state, dispatch,"Approved")
};
export const handleCreateUpdateSMID = (state, dispatch,status) => {
  let uuid = get(
    state.screenConfiguration.preparedFinalObject,
    "NulmSusvRequest.applicationUuid",
    null
  );
  if (uuid) {
    createUpdatePO(state, dispatch, "UPDATE",status);
  } else {
    createUpdatePO(state, dispatch, "CREATE",status);
  }
};



export const createUpdatePO = async (state, dispatch, action ,status) => {

  let NulmSusvRequest = get(
    state.screenConfiguration.preparedFinalObject,
    "NulmSusvRequest",
    []
  );

  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
 
  NulmSusvRequest.tenantId = tenantId;
  let queryObject = [{ key: "tenantId", value: tenantId }];
 
  //NulmSusvRequest.applicationStatus = status;
  const radioButtonValue = ["isDisability"];
    
  radioButtonValue.forEach(value => {
    if(NulmSusvRequest[value] && NulmSusvRequest[value]==="Yes" ){
      set( NulmSusvRequest, value, true );
    }else{
      set( NulmSusvRequest, value, false );
    }
  })
  

  const requestBody = {NulmSusvRequest};
  console.log("requestbody", requestBody);
  if (action === "CREATE") {
    try {
      if (status == "Drafted") {
        requestBody.NulmSusvRequest.action = "Drafted";
      } else if (status == "Created") { 
        requestBody.NulmSusvRequest.action = "Created";
      }
      const response = await httpRequest(
        "post",
        "/nulm-services/v1/susv/_create",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-nulm/acknowledgement?screen=susv&mode=create&code=${response.ResponseBody.applicationId}`));
      }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } else if (action === "UPDATE") {
    try {
      if (status == "Drafted") {
        requestBody.NulmSusvRequest.action = "Drafted";
      } else if (requestBody.NulmSusvRequest.applicationStatus=="Drafted" && status == "Created") { 
        requestBody.NulmSusvRequest.action = "Created";
      }else if (requestBody.NulmSusvRequest.applicationStatus == "Reassign To Citizen") {
        requestBody.NulmSusvRequest.action = 'Forward To JA';
      } 
      const response = await httpRequest(
        "post",
        "/nulm-services/v1/susv/_update",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-nulm/acknowledgement?screen=susv&mode=update&code=${response.ResponseBody.applicationId}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } 
};


