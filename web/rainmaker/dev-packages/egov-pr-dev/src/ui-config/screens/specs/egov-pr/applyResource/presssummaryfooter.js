import get from "lodash/get";
import {
  getLabel,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { 
  getButtonVisibility,
  getCommonApplyFooter
  } from "../../utils";
import "./index.css";
import { createUpdateNocApplication,deletePressmaster } from "../../../../../ui-utils/commons";
import {
  getFileUrlFromAPI,
  getQueryArg,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "../../../../../../../../packages/lib/egov-ui-kit/utils/localStorageUtils/index";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {  
   localStorageGet
 } from "egov-ui-kit/utils/localStorageUtils";
 import {  showHideAdhocPopupopmsReject } from "../../utils";
export const DeletePresmaterData = (state, dispatch) => {
  alert('aaa')
  var confirmCancel= confirm("Are you sure you want to delete this press?");
  if(confirmCancel===true)
  {
    let payload={
      "RequestBody":{ 
        "tenantId":getTenantId(),
        "pressMasterUuid":getQueryArg(window.location.href, "presstId"),
        "moduleCode":localStorageGet("modulecode")
       
      }}
      
        deletePressmaster(dispatch,payload);
    }
  };

const RedirectPresmaterData = (state, dispatch) => {
   dispatch(setRoute(`masterSubMenu`))
    
    
  };



export const callBackForNext = async (state, dispatch) => {
 
  let response = await createUpdateNocApplication(state, dispatch, "pressdetails_summary");
  if (get(response, "status", "") === "success") {
 
    
    const acknowledgementUrl =
      process.env.REACT_APP_SELF_RUNNING === "true"
        ? `/egov-ui-framework/pressdetails_summary/acknowledgement?purpose=pressdetails_summary&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
        : `/pressGrid/acknowledgement?purpose=pressdetails_summary&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    dispatch(setRoute(acknowledgementUrl));
  }
  
};


export const presssummaryfooter = getCommonApplyFooter({

  cancelButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Cancel",
        labelKey: "PR_CANCEL_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: RedirectPresmaterData
    },
     visible: true,
   
  },
  deleteButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Delete",
        labelKey: "PR_DELETE_BUTTON"
      })
    },
    // onClickDefination: {
    //   action: "condition",
    //   callBack: DeletePresmaterData
    // },
    onClickDefination: {
      action: "condition",
       callBack: (state, dispatch) =>{
        
            showHideAdhocPopupopmsReject(state, dispatch, "PressMasterSummary", "pressMaster")
    }
    },
    visible: true,
   
  },
 
});


