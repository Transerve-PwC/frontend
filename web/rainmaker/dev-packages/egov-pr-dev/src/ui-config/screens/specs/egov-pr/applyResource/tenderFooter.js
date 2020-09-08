import get from "lodash/get";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getCommonApplyFooter } from "../../utils";
import "./index.css";
import { createMasterTender, forwardMasterTender,UpdateMasterTender,updatestatustoPublishd } from "../../../../../ui-utils/commons";
import { getTenantId,localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
 
  getUserInfo,
  
} from "egov-ui-kit/utils/localStorageUtils";
import {  getQueryArg } from "egov-ui-framework/ui-utils/commons";

import {resendinvitationtender} from "../../egov-pr/searchResource/citizenSearchFunctions"
 


const RouteToPage = async (state, dispatch) => {
  
   const acknowledgementUrl =`/egov-pr/publishTender?tenderId=${getQueryArg(window.location.href, "tenderId")}&tenderuuId=${getQueryArg(window.location.href, "tenderuuId")}&tenantId=${getTenantId()}`;
  
  dispatch(setRoute(acknowledgementUrl));
// window.location.href = `/egov-pr/publishTender?tenderId=${getQueryArg(window.location.href, "tenderId")}&tenderuuId=${getQueryArg(window.location.href, "tenderuuId")}&tenantId=${getTenantId()}`;
    //}
  };
export const callBackForCreateTender = async (state, dispatch) => {
//alert(localStorageGet("tendernote"))
  
  let tenderNoticeUuid=getQueryArg(window.location.href, "tenderUuId")
  let tenderNoticeId=getQueryArg(window.location.href, "tenderId")
let date=get(state, "screenConfiguration.preparedFinalObject.tenderNotice.tenderDate", "")

if(tenderNoticeUuid!==null)
{
  
  if( get(state, "screenConfiguration.preparedFinalObject.tenderNotice.tenderSubject", "")=="" ||
  get(state, "screenConfiguration.preparedFinalObject.tenderNotice.tenderDate", "")=="" ||
  get(state, "screenConfiguration.preparedFinalObject.tenderNotice.fileNumber", "")==""||
  get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux.0.documents.0.fileStoreId")==""
  ||
get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux.0.documents.0.fileStoreId")==undefined

  )
  {
  
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill all fields!", labelKey: "" },
        "warning"
      )
    );
    
  }else{
    let data = {
      "RequestBody": {
        "tenantId": getTenantId(),
    
        "moduleCode": localStorageGet("modulecode"),
        "tenderSubject": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.tenderSubject", ""),
        "tenderDate":date[0],
        "fileNumber": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.fileNumber"),
        
       // "noteContent": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.noteContent", ""),
       "tenderNoticeUuid": tenderNoticeUuid,
       "tenderNoticeId": tenderNoticeId,
        "noteContent": localStorageGet("tendernote"),
        "moduleCode":localStorageGet("modulecode"),
        "tenderDocument":get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux.0.documents.0.fileStoreId")===undefined?[{ "fileStoreId":localStorageGet('tenderFilStore') }]: [{ "fileStoreId": get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux.0.documents.0.fileStoreId") }],
       



        
        


      },
      userInfo: JSON.parse(getUserInfo()),
    }
   
    let response = await UpdateMasterTender(dispatch,data);
    if (get(response.ResponseInfo, "status", "") === "Success") {
      dispatch( toggleSnackbar(
        true,
        { labelName: 'Tender updated successfully', labelCode: 'PR_UPDATE_TENDER_MSG' },
        "success"
      ))
      const acknowledgementUrl ='dashboardHome?modulecode='+localStorageGet('modulecode')
       
      dispatch(setRoute(acknowledgementUrl));
    }
  }
  }

else{
  

if( get(state, "screenConfiguration.preparedFinalObject.tenderNotice.tenderSubject", "")=="" ||
get(state, "screenConfiguration.preparedFinalObject.tenderNotice.tenderDate", "")=="" ||
get(state, "screenConfiguration.preparedFinalObject.tenderNotice.fileNumber", "")=="" ||
get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux.0.documents.0.fileStoreId")==""
||
get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux.0.documents.0.fileStoreId")==undefined


)
{

  dispatch(
    toggleSnackbar(
      true,
      { labelName: "Please fill all fields!", labelKey: "" },
      "warning"
    )
  );
  
}else{
  let data = {
    "RequestBody": {
      "tenantId": getTenantId(),
      "tenderNoticeStatus": "CREATED",
      "moduleCode": localStorageGet("modulecode"),
      "tenderSubject": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.tenderSubject", ""),
      "tenderDate": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.tenderDate", ""),
      "fileNumber": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.fileNumber", ""),
   
     "noteContent": localStorageGet("tendernote"),
      "moduleCode":localStorageGet("modulecode"),
      "tenderDocument": [{ "fileStoreId": get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux.0.documents.0.fileStoreId") }]
    },
    userInfo: JSON.parse(getUserInfo()),
  }
 
  let response = await createMasterTender(dispatch,data);
  if (get(response.ResponseInfo, "status", "") === "Success") {

    dispatch(toggleSpinner());
  dispatch(  toggleSnackbar(
      true,
      { labelName: 'Tender created suceessfully', labelCode: 'PR_CREATE_TENDER_MSG' },
      "success"
    ))
    const acknowledgementUrl ='dashboardHome?modulecode='+localStorageGet("modulecode")
    dispatch(setRoute(acknowledgementUrl));
  }
  else{
    dispatch(toggleSpinner());
  }
}
};
}



const gotoHome = async (state, dispatch) => {
  const acknowledgementUrl ='dashboardHome?modulecode='+localStorageGet("modulecode")
 
   dispatch(setRoute(acknowledgementUrl));
}
 
export const tenderFooter = getCommonApplyFooter({
  
    payButton: {
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
        submitButtonLabel: getLabel({
          labelName: "SUBMIT",
          labelKey: "PR_COMMON_BUTTON_SUBMIT"
        }),
        submitButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "keyboard_arrow_right"
          }
        }
      },
      onClickDefination: {
        action: "condition",
        callBack: callBackForCreateTender
      },
      visible: true
    }
  });

export const tenderSummaryfooter = getCommonApplyFooter({
 resendbutton: {
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
      submitButtonLabel: getLabel({
        labelName: "RESEND TENDER NOTICE",
        labelKey: "PR_RESEND_TENDER_BUTTON"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: resendinvitationtender
    },
    visible:false
  },
publishedButton: {
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
        labelName: "Published",
        labelKey: "PR_TENDER_COMMON_BUTTON_PUBLISHED"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: RouteToPage
    },
    visible:false

   
  },
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
        labelName: "CANCEL",
        labelKey: "PR_BUTTON_CANCEL"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: gotoHome
    },
     visible: true,
    
  },

});


export const callBackForUpdateTender = async (state, dispatch) => {
  let data = {
    "RequestBody": {
      "tenantId": getTenantId(),
      "tenantId1": `${getTenantId()}`,
      "tenderNoticeStatus": "CREATED",
      "moduleCode": localStorageGet("modulecode"),
      "billAmount": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.billAmount", ""),
      "tenderSubject": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.tenderSubject", ""),
      "tenderDate": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.tenderDate", ""),
      "fileNumber": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.fileNumber", ""),
      "noteContent": get(state, "screenConfiguration.preparedFinalObject.tenderNotice.noteContent", ""),
      "billDocument": [{ "fileStoreId": get(state, "screenConfiguration.preparedFinalObject.documentsUploadRedux.0.documents.0.fileStoreId", {}) }]
    }
  }
  let response = await forwardMasterTender(data);
  if (get(response.ResponseInfo, "status", "") === "Success") {
    const acknowledgementUrl =
      process.env.REACT_APP_SELF_RUNNING === "true"
        ? `/egov-ui-framework/egov-pr/tender-Summary?purpose=pressdetails_summary&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
        : `/egov-pr/tender-Summary?applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
    dispatch(setRoute(acknowledgementUrl));
  }
};



export const callTenderSearch = async (state, dispatch) => {
dispatch(setRoute(`/egov-pr/tenderSearch`));
}