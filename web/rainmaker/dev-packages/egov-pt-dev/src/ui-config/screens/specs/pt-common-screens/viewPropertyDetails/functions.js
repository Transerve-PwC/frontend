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


const handleRejectApprove =  async(state, dispatch,status) => {
 
}

export const handleCreateUpdate = (state, dispatch,status) => {
  let uuid = get(
    state.screenConfiguration.preparedFinalObject,
    "NulmSuhLogRequest.logUuid",
    null
  );
  if (uuid) {
    createUpdatePO(state, dispatch, "UPDATE",status);
  } else {
    createUpdatePO(state, dispatch, "CREATE",status);
  }
};

export const createUpdatePO = async (state, dispatch, action,status) => {

  let NulmSuhLogRequest = get(
    state.screenConfiguration.preparedFinalObject,
    "NulmSuhLogRequest",
    []
  );
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  
  NulmSuhLogRequest.tenantId = tenantId;
  let queryObject = [{ key: "tenantId", value: tenantId }];
 //setting status
   NulmSuhLogRequest.status = status;

  

  const requestBody = {NulmSuhLogRequest};
  console.log("requestbody", requestBody);

  if (action === "CREATE") {
    try {
      const response = await httpRequest(
        "post",
        "/nulm-services/v1/suh/log/_create",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-nulm/acknowledgement?screen=suhlog&mode=create&code=${response.ResponseBody.nameOfShelter}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } else if (action === "UPDATE") {
    try {
      const response = await httpRequest(
        "post",
        "/nulm-services/v1/suh/log/_update",
        "",
        queryObject,
        requestBody
      );
       if(response){
        dispatch(setRoute(`/egov-nulm/acknowledgement?screen=suhlog&mode=update&code=${response.ResponseBody.nameOfShelter}`));
       }
  
    } catch (error) {
      dispatch(toggleSnackbar(true, { labelName: error.message, labelCode: error.message }, "error" ) );
    }
  } 
};


