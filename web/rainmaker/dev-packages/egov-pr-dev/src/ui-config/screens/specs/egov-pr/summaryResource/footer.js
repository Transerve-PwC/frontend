import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { cancelEventApplication } from "../../../../../ui-utils/commons";
import { getCommonApplyFooter } from "../../utils";
import "./index.scss";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "../../../../../../../../packages/lib/egov-ui-kit/utils/localStorageUtils/index";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg ,getFileUrlFromAPI} from "egov-ui-framework/ui-utils/commons";
import {  showHideAdhocPopupopmsReject } from "../../utils";


const cancelTohome = async (state, dispatch) => {
  
  setTimeout(function(){  
    
    const acknowledgementUrl =localStorageGet("modulecode")==="PR"?`/egov-pr/home?modulecode=`+localStorageGet("modulecode"):
    `/egov-pr/home-scp?modulecode=`+localStorageGet("modulecode")
    dispatch(setRoute(acknowledgementUrl));

}, 1500); 

  
};


const updateNocApplication = async (state, dispatch) => {

 let msg= getQueryArg(window.location.href, "responseMessage")
 if(msg)
 {
  let errorMessage = {
    labelName: "",
    labelKey: msg
  };



  dispatch(toggleSnackbar(true, errorMessage, "success"))
}
 

  setTimeout(function(){  
    
    const acknowledgementUrl =localStorageGet("modulecode")==="PR"?`/egov-pr/home?modulecode=`+localStorageGet("modulecode"):
    `/egov-pr/home-scp?modulecode=`+localStorageGet("modulecode")
    dispatch(setRoute(acknowledgementUrl));
    
  
}, 1500); 

 
};
const goToHome = async (state, dispatch) => {

  const appendUrl =
  process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  let reviewUrl = "";
  if(localStorageGet("modulecode") == "PR")
  {
    reviewUrl = `${appendUrl}/egov-pr/home?modulecode=PR`;
  }
  else
  {
    reviewUrl = `${appendUrl}/egov-pr/home-scp?modulecode=SCP`;
  }
dispatch(setRoute(reviewUrl));
}

const cancelNocApplication = async (state, dispatch) => {
  var confirmCancel= confirm("Are you sure you want to cancel this event?");
if(confirmCancel===true)
{
let data={"RequestBody":{
  
      
              "tenantId": getTenantId(),
              "moduleCode": localStorageGet("modulecode"),
              "eventDetailUuid": getQueryArg(window.location.href, "eventuuId"),
              "eventStatus": "CANCELLED"
          } }
          cancelEventApplication(state, dispatch,data)

 }
       
  //}
};
const setInvitePageRoutehome = async (state, dispatch) => { 
    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  
      if(localStorageGet("modulecode") == "PR")
      {
       const reviewUrl = `${appendUrl}/egov-pr/home?modulecode=PR`;
      }
      else
      {
       const reviewUrl = `${appendUrl}/egov-pr/home-scp?modulecode=SCP`;
      }
      dispatch(setRoute(reviewUrl));
}

const setInvitePageRoutecreateinvite = async (state, dispatch) =>{  
   const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-pr/createInvite`;
    dispatch(setRoute(reviewUrl));
};



export const EventSummaryFooter = getCommonApplyFooter({
  cancelEventButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      testButtonLabel: getLabel({
        labelName: "CANCEL",
        labelKey: "PR_COMMON_BUTTON_CANCEL_EVENT"
      }),
      testButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    
    onClickDefination: {
      action: "condition",
       callBack: (state, dispatch) =>{
        
            showHideAdhocPopupopmsReject(state, dispatch, "summary", "pressMaster")
    }
    },
    ///visible:getQueryArg(window.location.href,"status")==="EXPIRED"  || getQueryArg(window.location.href, "eventstatus")==="CANCELLED" ?false:true

    visible:false


  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      cancelButtonLabel: getLabel({
        labelName: "SUBMIT",
        labelKey: "PR_COMMON_BUTTON_SUBMIT"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      },
    },
    onClickDefination: {
      action: "condition",
      callBack: updateNocApplication
    },
  //  visible:getQueryArg(window.location.href,"status")==="EXPIRED"  || getQueryArg(window.location.href, "eventstatus")==="CANCELLED" ?false:true
    
  visible:false
  },
  cancelbtn: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      testButtonLabel: getLabel({
        labelName: "CANCEL",
        labelKey: "PR_COMMON_BUTTON_CANCEL"
      }),
      testButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: cancelTohome
    },
   // visible:getQueryArg(window.location.href, "status")==="EXPIRED" || getQueryArg(window.location.href, "eventstatus")==="CANCELLED" ?true:false
   visible:false
   


  },

 

});
export const ApplySummaryfooter = getCommonApplyFooter({
  
  
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      cancelButtonLabel: getLabel({
        labelName: "SUBMIT",
        labelKey: "PR_COMMON_BUTTON_SUBMIT"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      },
    },
    onClickDefination: {
      action: "condition",
      callBack: updateNocApplication
    }
  }
,
 

});


export const eventInviteFooter = getCommonApplyFooter({
  cancelButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Cancel",
        labelKey: "PR_CANCEL_BUTTON"
      }),
     
    },
    onClickDefination: {
      action: "condition",
      callBack: setInvitePageRoutehome
    }
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Invite Guest",
        labelKey: "PR_EVENT_GEUST_INVITE_BUTTON"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: setInvitePageRoutecreateinvite
    }
  }
});
