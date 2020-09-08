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
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
let status = getQueryArg(window.location.href, "status");
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




export const handleSubmit = (state, dispatch) =>{
  handleCreateUpdate(state, dispatch,"CREATED")
};
export const handlesave = (state, dispatch) =>{
  handleCreateUpdate(state, dispatch,"DRAFTED")
};
export const handleReject = (state, dispatch) =>{
handleRejectApprove(state, dispatch,"REJECTED");
};
export const handleApprove = async(state, dispatch) =>{
handleRejectApprove(state, dispatch,"APPROVED");
};
export const handleApprovalAwait  = async(state, dispatch) =>{
 //forward to employee if shg members more than 10
 if(status !=="AWAITINGFORAPPROVAL"){
 const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
 let queryObject = [{ key: "tenantId", value: tenantId }];
 let uuid = get(
  state.screenConfiguration.preparedFinalObject,
  "NulmShgRequest.shgUuid",
  null
);

let NulmShgMemberRequest ={}
NulmShgMemberRequest.shgUuid = uuid;
NulmShgMemberRequest.tenantId = tenantId;
const requestBody = {NulmShgMemberRequest}
try {
  const response = await httpRequest(
    "post",
    "/nulm-services/v1/smid/shg/member/_memberCount",
    "",
    queryObject,
    requestBody
  );
   if(response && response.ResponseBody[0]){
     const {membercount} = response.ResponseBody[0];
     if(parseInt(membercount,10) >= 10){
      let queryObject1  = [{ key: "tenantId", value: tenantId }];
      let uuid = get(
       state.screenConfiguration.preparedFinalObject,
       "NulmShgRequest.shgUuid",
       null
     );
     let applicationId = get(
      state.screenConfiguration.preparedFinalObject,
      "NulmShgRequest.shgId",
      null
    );
     let NulmShgRequest ={}
     NulmShgRequest.shgUuid = uuid;
     NulmShgRequest.tenantId = tenantId;
     
     const requestBody = {NulmShgRequest}
     try {
       const response = await httpRequest(
         "post",
         "/nulm-services/v1/smid/shg/_forwardToApproval",
         "",
         queryObject1,
         requestBody
       );
        if(response){
         dispatch(setRoute(`/egov-nulm/acknowledgement?screen=smidOrg&mode=forwardtoapproval&code=${applicationId}`));
        }
     
     } catch (error) {
       dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
     }
     }
     else{
      const errorMessage = {
        labelName: "SHG Member should be more than 10",
        labelKey: "NULM_SHG_MEMBER_COUNT"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
      return true;
     }
   }

} catch (error) {
  dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
}
 }
 else{
  const errorMessage = {
    labelName: "Application is already in awaiting for approval status",
    labelKey: "NULM_SHG_MEMBER_MESSAGE_AWAIT_APPROVAL"
  };
  dispatch(toggleSnackbar(true, errorMessage, "warning"));
  return true;
 }
 };

const handleRejectApprove =  async(state, dispatch,status) => {
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  let queryObject = [{ key: "tenantId", value: tenantId }];
  let uuid = get(
   state.screenConfiguration.preparedFinalObject,
   "NulmShgRequest.shgUuid",
   null
 );
 let applicationId = get(
   state.screenConfiguration.preparedFinalObject,
   "NulmShgRequest.shgId",
   null
 );
 let NulmShgRequest ={}
 NulmShgRequest.shgUuid = uuid;
 NulmShgRequest.tenantId = tenantId;
 NulmShgRequest.status = status;
 
 const requestBody = {NulmShgRequest}
 try {
   const response = await httpRequest(
     "post",
     "/nulm-services/v1/smid/shg/_updateAppStatus",
     "",
     queryObject,
     requestBody
   );
    if(response){
     dispatch(setRoute(`/egov-nulm/acknowledgement?screen=smidOrg&mode=${status}&code=${applicationId}`));
    }
 
 } catch (error) {
   dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
 }
}

export const handleCreateUpdate = (state, dispatch,status) => {
  let uuid = get(
    state.screenConfiguration.preparedFinalObject,
    "NulmShgRequest.shgUuid",
    null
  );
  if (uuid) {
    createUpdatePO(state, dispatch, "UPDATE",status);
  } else {
    createUpdatePO(state, dispatch, "CREATE",status);
  }
};

export const createUpdatePO = async (state, dispatch, action,status) => {

  let NulmShgRequest = get(
    state.screenConfiguration.preparedFinalObject,
    "NulmShgRequest",
    []
  );
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  
  NulmShgRequest.tenantId = tenantId;
  let queryObject = [{ key: "tenantId", value: tenantId }];
 //setting status
   NulmShgRequest.status = status;

  

  const requestBody = {NulmShgRequest};
  console.log("requestbody", requestBody);

  if (action === "CREATE") {
    try {
      const response = await httpRequest(
        "post",
        "/nulm-services/v1/smid/shg/_create",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-nulm/acknowledgement?screen=smidOrg&mode=create&code=${response.ResponseBody.shgId}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } else if (action === "UPDATE") {
    try {
      const response = await httpRequest(
        "post",
        "/nulm-services/v1/smid/shg/_update",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-nulm/acknowledgement?screen=smidOrg&mode=update&code=${response.ResponseBody.shgId}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } 
};


