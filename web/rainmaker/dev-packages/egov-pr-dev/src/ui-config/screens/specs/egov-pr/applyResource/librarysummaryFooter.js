
import {
  getLabel,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";

import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  getButtonVisibility,
  getCommonApplyFooter
  } from "../../utils";
  import {
 
    getUserInfo
  } from "egov-ui-kit/utils/localStorageUtils"
import "./index.css";
import {role } from "../../../../../ui-utils/commonConfig";

let role_name=JSON.parse(getUserInfo()).roles[0].code;
let roles=role[0];



  export const redirectfunction = async (state, dispatch) => {
    const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    let reviewUrl = '';
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

export const uploadlibraryDocument = async (state, dispatch) => {
  const eventuuId= getQueryArg(window.location.href, "eventuuId");
  const eventId= getQueryArg(window.location.href, "eventId");
  const tenantId= getQueryArg(window.location.href, "tenantId");
  const appendUrl =
  process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-pr/libraryUpload?eventId=${eventId}&eventuuId=${eventuuId}&tenantId=${tenantId}`;
      dispatch(setRoute(reviewUrl));
}

export const  librarysummaryFooter = getCommonApplyFooter({

  

  cancleButton: {
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
        labelName: "UPLOAD",
        labelKey: "PR_COMMON_BUTTON_CANCLE"
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
      callBack: redirectfunction
    },
    visible: true
  },
  uploadButton: {
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
        labelName: "UPLOAD",
        labelKey: "PR_COMMON_BUTTON_UPLOAD"
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
      callBack: uploadlibraryDocument
    },
    visible:false
  } 
});


