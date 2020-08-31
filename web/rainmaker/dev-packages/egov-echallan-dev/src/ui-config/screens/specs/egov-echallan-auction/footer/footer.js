import {
  dispatchMultipleFieldChangeAction,
  getLabel,
  convertEpochToDate
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { getCommonApplyFooter, checkForRole } from "../../utils";
import "./index.css";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { approverejectAuctionDetails, findItemInArrayOfObject } from "../../../../../ui-utils/commons";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { toggleSpinner, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./customfooter.css"

let roles = JSON.parse(getUserInfo()).roles;
//alert('CITIZEN');
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;

const callbackforsummaryaction = async (state, dispatch) => {

  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-echallan-auction/home`;
  dispatch(setRoute(reviewUrl));

};

const callbackforAuction = async (state, dispatch) => {

  let challandetails = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', {});
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-echallan-auction/apply?applicationNumber=${
    challandetails.challanId
    }&tenantId=${challandetails.tenantId}&Key=${challandetails.challanUuid}`;
  dispatch(setRoute(reviewUrl));

};

const callbackforAuctionApprove = async (state, dispatch) => {

  try {

    dispatch(toggleSpinner());
    let response = await approverejectAuctionDetails(state, dispatch, "APPROVE");
    dispatch(toggleSpinner());
    let responseStatus = get(response, "status", "");

    if (responseStatus === 'SUCCESS' || responseStatus === 'success') {

      dispatch(toggleSnackbar(true, {
        labelName: "Auction Details has been Approved!",
        labelKey: "EC_AUCTION_APPROVER_SUCCESS_TOASTER"
      }, "success"));
      callbackforsummaryaction(state, dispatch);
    } else {
      dispatch(toggleSnackbar(true, {
        labelName: "Submission Falied, Try Again later!",
        labelKey: "EC_AUCTION_APPROVER_FAIL_TOASTER",
      }, "warning"));
    }
  } catch (error) {
    console.log(error);
  }

};

const callbackforAuctionReject = async (state, dispatch) => {
  try {

    dispatch(toggleSpinner());
    let response = await approverejectAuctionDetails(state, dispatch, "REJECT");
    dispatch(toggleSpinner());
    let responseStatus = get(response, "status", "");
    if (responseStatus == 'SUCCESS' || responseStatus == 'success') {
      dispatch(toggleSnackbar(true, {
        labelName: "Auction Details has been Rejected!",
        labelKey: "EC_AUCTION_APPROVER_FAIL_TOASTER"
      }, "success"));
      callbackforsummaryaction(state, dispatch);
    } else {
      dispatch(toggleSnackbar(true, {
        labelName: "Submission Falied, Try Again later!",
        labelKey: "EC_AUCTION_APPROVER_FAIL_TOASTER",
      }, "warning"));
    }
  } catch (error) {
    console.log(error);
  }

};
export const titlebarfooter = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px",
        background: "#fff",
        border: "1px solid #ddd",
        color: "#000"
      },
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12,
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
        labelName: "Back",
        labelKey: "EC_ECHALLAN_COMMON_BUTTON_BACK"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callbackforsummaryaction
    },
    visible: true
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px",
        background: "#fff",
        border: "1px solid #ddd",
        color: "#000"
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12,
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "INITATE AUCTION",
        labelKey: "EC_AUCTION_BUTTON"
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
      callBack: callbackforAuction
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanSM"],
      action: "AUCTION"
    },
    visible: true
  },
  approveButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px",
        background: "#fff",
        border: "1px solid #ddd",
        color: "#000"
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12,
    },

    children: {
      approveButtonLabel: getLabel({
        labelName: "APPROVE",
        labelKey: "EC_AUCTION_APPROVE_BUTTON"
      }),
      approveButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callbackforAuctionApprove
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanHOD"],
      action: "AUCTION"
    },
    visible: true
  },
  rejectButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px",
        background: "#fff",
        border: "1px solid #ddd",
        color: "#000"
      }
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12,
    },

    children: {
      rejectButtonLabel: getLabel({
        labelName: "REJECT",
        labelKey: "EC_AUCTION_REJECT_BUTTON"
      }),
      rejectButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callbackforAuctionReject
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanHOD"],
      action: "AUCTION"
    },
    visible: true
  }
});


const toggleactionmenu = (state, dispatch) => {

  var x = document.getElementById("custom-atoms-employeeFooter");
  // if (x.style.display === "none") {
  if (window.getComputedStyle(x).display === "none") {
    x.style.display = "block";
    x.classList.add("addpadding");
  } else {
    x.style.display = "none";
    x.classList.remove("addpadding");
  }
}

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
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12,
    },
    children: {

      pressguestbuttonLabel: getLabel({
        labelName: "Take Action",
        labelKey: "EC_TAKE_ACTION"
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