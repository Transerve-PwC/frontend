import {
  getLabel,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getCommonApplyFooter,
  showHideAdhocPopupopmsReject,
  showHideAdhocPopup,
  showHideAdhocPopupopmsReassign,
  showHideAdhocPopupopmsApprove,
  showHideAdhocPopupopmsForward, checkForRole
} from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import "./customfooter.css";

import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import { getapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import { callbackforSummaryActionCancel, callbackforSummaryActionSubmit } from '../roadcutnoc_summary'
import { checkVisibility } from '../../../../../ui-utils/commons'
import set from "lodash/set";

let roles = JSON.parse(getUserInfo()).roles
const toggleactionmenu = (state, dispatch) => {

  var x = document.getElementById("custom-atoms-footerEmp");
  // if (x.style.display === "none") {
  if (window.getComputedStyle(x).display === "none") {
    x.style.display = "block";
    x.classList.add("addpadding");
  } else {
    x.style.display = "none";
    x.classList.remove("addpadding");
  }
}
const callbackforsummaryactionpay = async (dispatch) => {
  let tenantId = getOPMSTenantId();
  //alert("enter here")
  const applicationid = getQueryArg(window.location.href, "applicationNumber");
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-opms/pay?applicationNumber=${applicationid}&tenantId=${tenantId}`;
  dispatch(setRoute(reviewUrl));

}


const certificateDownloadObjectROADCUT = {
  label: { labelName: "NOC Certificate ROADCUT", labelKey: "NOC_CERTIFICATE_ROADCUT" },
  link: () => {
    showHideAdhocPopupopmsForward(store.getState(), store.dispatch, "roadcutnoc-search-preview", "nextButton")
  },
  leftIcon: "book"
};
const downloadMenu = [
  certificateDownloadObjectROADCUT
];
export const footerCitizen = getCommonApplyFooter({
  MakePayment: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "inherit"
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "MakePayment",
        labelKey: "NOC_COMMON_BUTTON_MAKE_PAYMENT"
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
      callBack: (state, dispatch) => {
        callbackforsummaryactionpay(dispatch);
      }
    },
    visible: false
  },
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",

      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      cancelButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "NOC_CANCEL_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callbackforSummaryActionCancel
    },
    visible: false
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px"
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "SEND",
        labelKey: "NOC_SUBMIT_BUTTON"
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
      callBack: callbackforSummaryActionSubmit
    },
    visible: false
  }
})
export const footerEmp = getCommonApplyFooter({
  // downloadMenu: {
  //   uiFramework: "custom-atoms-local",
  //   moduleName: "egov-opms",
  //   componentPath: "MenuButton",
  //   props: {
  //     data: {
  //       label: "Download",
  //       leftIcon: "cloud_download",
  //       rightIcon: "arrow_drop_down",
  //       props: { variant: "outlined", style: { marginLeft: 10 } },
  //       menu: downloadMenu
  //     }
  //   }
  // },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "2px",
        background: "#fff",
        color: '#000',
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "FORWARD",
        labelKey: "FORWARD"
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
      callBack: (state, dispatch) => {
        set(state, 'screenConfiguration.preparedFinalObject.ROADCUTNOCWF.REASSIGNDO', false);
        if (localStorageGet("applicationStatus") == "INITIATED" || localStorageGet("applicationStatus") == "REASSIGNTOJE" || localStorageGet("applicationStatus") == "RESENT") {
          showHideAdhocPopup(state, dispatch, "roadcutnoc-search-preview")
        } else {
          showHideAdhocPopupopmsForward(state, dispatch, "roadcutnoc-search-preview", "nextButton")
        }
      }
    },
    //    visible: checkForRole(roles, 'JE') || checkForRole(roles, 'SDO') || checkForRole(roles, 'EE') || checkForRole(roles, 'SE') ? true : false
    visible: false//checkVisibility("REVIEWSDO,REVIEWOFSE,REVIEWOFEE")
  },
  reject: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "2px",
        background: "#fff",
        color: '#000',
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "REJECT",
        labelKey: "REJECT"
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

      callBack: (state, dispatch) => {

        set(state, 'screenConfiguration.preparedFinalObject.ROADCUTNOCWF.REASSIGNDO', false);
        showHideAdhocPopupopmsReject(state, dispatch, "roadcutnoc-search-preview", "reject")
      }
    },
    visible: false
  },
  reassign: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "2px",
        background: "#fff",
        color: '#000',
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "REASSIGN",
        labelKey: "REASSIGN"
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

      callBack: (state, dispatch) => {
        set(state, 'screenConfiguration.preparedFinalObject.ROADCUTNOCWF.REASSIGNDO', false);
        showHideAdhocPopupopmsReassign(state, dispatch, "roadcutnoc-search-preview", "reject")
      }
    },
    //    visible: checkForRole(roles, 'JE') || checkForRole(roles, 'SDO') || checkForRole(roles, 'CE') || checkForRole(roles, 'EE') || checkForRole(roles, 'SE') ? true : false
    visible: false
  },
  reassignToDO: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "2px",
        background: "#fff",
        color: '#000'
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "REASSIGN TO DO",
        labelKey: "PM_REASSIGNTODO"
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

      callBack: (state, dispatch) => {
        set(state, 'screenConfiguration.preparedFinalObject.ROADCUTNOCWF.REASSIGNDO', true);
        showHideAdhocPopupopmsReassign(state, dispatch, "roadcutnoc-search-preview", "reject")
      }
    },
    //    visible: checkForRolecheckForRole(roles, 'JE') || checkForRole(roles, 'SDO') || checkForRole(roles, 'CE') || checkForRole(roles, 'EE') || checkForRole(roles, 'SE') ? true : false
    visible: false
  },
  approve: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "2px",
        background: "#fff",
        color: '#000',
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "APPROVE",
        labelKey: "APPROVE"
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
      callBack: (state, dispatch) => {
        set(state, 'screenConfiguration.preparedFinalObject.ROADCUTNOCWF.REASSIGNDO', false);
        showHideAdhocPopupopmsApprove(state, dispatch, "roadcutnoc-search-preview", "reject")
      }
    },
    visible: false
  },
  MakePayment: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "2px",
        background: "#fff",
        color: '#000',
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "MakePayment",
        labelKey: "NOC_COMMON_BUTTON_MAKE_PAYMENT"
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
      callBack: (state, dispatch) => {
        callbackforsummaryactionpay(dispatch);
      }
    },
    visible: false
  },
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        background: "#fff",

      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      cancelButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "NOC_CANCEL_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callbackforSummaryActionCancel
    },
    visible: false
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "2px",
        background: "#fff",
        color: '#000',
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "SEND",
        labelKey: "NOC_SUBMIT_BUTTON"
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
      callBack: callbackforSummaryActionSubmit
    }
  }

});

export const takeactionfooter = getCommonApplyFooter({
  actionbutton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {

      pressguestbuttonLabel: getLabel({
        labelName: "Take Action",
        labelKey: "PM_TAKE_ACTION"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_up"
        }
      },
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        toggleactionmenu(state, dispatch)
      }
    },
    visible: true
  }
});
