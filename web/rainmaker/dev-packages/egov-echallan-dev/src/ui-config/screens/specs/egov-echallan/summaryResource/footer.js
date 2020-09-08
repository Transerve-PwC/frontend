import { getLabel, getTodaysDateInYMD, convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { createUpdateNocApplication, UpdateChallanStatus, addToStoreViolationData, addToStoreReturnCloseData } from "../../../../../ui-utils/commons";
import { getCommonApplyFooter, showHideAdhocPopupReceivePayment, showHideAdhocPopupForwardUploadDocs, callbackforsearchPreviewAction, getDiffernceBetweenTodayDate, getTextToLocalSeizedItemDetailHeader, showHideChallanConfirmation } from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  toggleSnackbar, prepareFinalObject, handleScreenConfigurationFieldChange as handleField,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "ui-redux/store";
import "./index.css";
import "./customfooter.css";
import set from "lodash/set";

let state = store.getState();

let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let tenant = getQueryArg(window.location.href, "tenantId");
let paymentStatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", 'Not Available');

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false :
  paymentStatus === 'PAID' ? false : true;


const callbackforAuction = async (state, dispatch) => {

  let challandetails = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0]', {});
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  const reviewUrl = `${appendUrl}/egov-echallan-auction/apply?applicationNumber=${
    challandetails.challanId
    }&tenantId=${challandetails.tenantId}&Key=${challandetails.challanUuid}`;
  dispatch(setRoute(reviewUrl));

};

const updateonGroundPayment = async (state, dispatch) => {
  let paymentStatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", 'Not Available');
  if (paymentStatus !== 'PAID') {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "You cannot mark the challan as close since payment status" + " " + paymentStatus, labelKey: "EC_TOASTER_ON_GROUND_PAYMENT_PENDING" },
        "warning"
      )
    );
  } else {
    showHideChallanConfirmation(state, dispatch, "search-preview");
    // let challanClose = window.confirm('Are you sure you want to Return & Close the Challan?')
    // if (challanClose) {

    // }
  }
};

const returnandClosePayment = async (state, dispatch) => {
  let paymentStatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", 'Not Available');
  if (paymentStatus !== 'PAID') {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "You cannot mark the challan as close since payment status" + " " + paymentStatus, labelKey: "EC_TOASTER_ON_GROUND_PAYMENT_PENDING" },
        "warning"
      )
    );
  } else {
    let response = await addToStoreReturnCloseData(state, dispatch, "CLOSED");
    if (response.status === 'success') {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Challan has been closed", labelKey: "EC_TOASTER_ON_GROUND_PAYMENT_SUCCESS" },
          "success"
        )
      );
      callbackforsearchPreviewAction(state, dispatch);
    } else {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Please try after sometime", labelKey: "EC_TOASTER_ON_GROUND_PAYMENT_ERROR" },
          "error"
        )
      );
    }
  }
};

const updateonSentToStore = async (state, dispatch) => {
  let paymentStatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", 'Not Available');
  let response = await UpdateChallanStatus(state, dispatch, "SENT TO STORE");
  if (response.status === 'success') {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Challan has been notified to Store Manager", labelKey: "EC_TOASTER_SENT_TO_STORE_SUCCESS" },
        "success"
      )
    );
    callbackforsearchPreviewAction(state, dispatch);
  } else {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please try after sometime ", labelKey: "EC_TOASTER_SENT_TO_STORE_ERROR" },
        "error"
      )
    );
  }

};

const callBackAddToStore = async (state, dispatch, isVerified) => {

  let seizeditemlist = get(state, 'screenConfiguration.preparedFinalObject.eChallanSMSeizedList', {});
  let isIntactqtyavailable = true;
  let isdamageqtyreq = false;
  let isdamageqtyavailable = false;
  let isremarkavailable = true;
  let issumlessthenseizedqty = false;
  let isdamageqtyavailableZero = true;
  let itemNamecommaseperated = '';


  seizeditemlist.forEach(element => {

    let isErrorinElement = false;

    if (element[3] === '') {
      isErrorinElement = true;
      if (isIntactqtyavailable) {
        //itemNamecommaseperated += element[0] + ','
        isIntactqtyavailable = false;
      }
    }

    if (parseInt(element[3]) < 0) {
      isErrorinElement = true;
      if (isIntactqtyavailable) {
        //itemNamecommaseperated += element[0] + ','
        isIntactqtyavailable = false;
      }
    }

    if (element[5] === '') {
      isErrorinElement = true;
      if (isremarkavailable) {
        //itemNamecommaseperated += element[0] + ','
        isremarkavailable = false;
      }
    }

    if ((parseInt(element[1]) - parseInt(element[3])) === 0) {
      if (element[4] === '') {
        isErrorinElement = true;
        if (isdamageqtyavailableZero) {
          //itemNamecommaseperated += element[0] + ','
          isdamageqtyavailableZero = false;
        }
      }
    }
    if ((parseInt(element[1]) - parseInt(element[3])) < 0) {
      isErrorinElement = true;
      if (!isdamageqtyreq) {
        //itemNamecommaseperated += element[0] + ','
        isdamageqtyreq = true;
      }
    }
    if (parseInt(element[1]) !== (parseInt(element[3]) + parseInt(element[4]))) {
      isErrorinElement = true;
      if (!issumlessthenseizedqty) {
        //itemNamecommaseperated += element[0] + ','
        issumlessthenseizedqty = true;
      }
    }
    if (parseInt(element[4]) > 0) {
      if (!isdamageqtyavailable) {
        //isErrorinElement = true;
        //itemNamecommaseperated += element[0] + ','
        isdamageqtyavailable = true;
      }
    }
    if (isErrorinElement) {
      itemNamecommaseperated += element[0] + ','
    }
  });

  let uniqueArray = [];
  let finalcommaseperatedItem = '';
  // if (itemNamecommaseperated != '') {


  //   let itemerror = itemNamecommaseperated.substr(itemNamecommaseperated, itemNamecommaseperated.length - 1).split(',');
  //   for (let i = 0; i < itemerror.length; i++) {
  //     if (uniqueArray.indexOf(itemerror[i]) === -1) {
  //       uniqueArray.push(itemerror[i]);
  //       finalcommaseperatedItem += itemerror[i] + ","
  //     }
  //   }
  finalcommaseperatedItem = itemNamecommaseperated.substr(itemNamecommaseperated, itemNamecommaseperated.length - 1);
  // }

  if (!isIntactqtyavailable) {
    let IntactQtyBlankMessage = getTextToLocalSeizedItemDetailHeader("intactQtyBlank") + " " + finalcommaseperatedItem;
    dispatch(toggleSnackbar(true,
      {
        labelName: IntactQtyBlankMessage,
        labelKey: ""
      }, "warning"));

    // dispatch(toggleSnackbar(true,
    //   { labelName: "Intact quantity cannot be left blank or be less then 0 at items " + finalcommaseperatedItem, labelKey: "" },
    //   "warning"));
  } else if (!isdamageqtyavailableZero) {
    let DamageQtyBlankMessage = getTextToLocalSeizedItemDetailHeader("damageQtyBlank") + " " + finalcommaseperatedItem;
    dispatch(toggleSnackbar(true,
      {
        labelName: DamageQtyBlankMessage,
        labelKey: ""
      }, "warning"));
    // dispatch(toggleSnackbar(true,
    //   { labelName: "Damage quantity should be 0 at items " + finalcommaseperatedItem, labelKey: "" },
    //   "warning"));
  }
  else if (isdamageqtyreq) {
    let DamageQtyReqMessage = getTextToLocalSeizedItemDetailHeader("damageQtyRequired") + " " + finalcommaseperatedItem;
    dispatch(toggleSnackbar(true,
      {
        labelName: DamageQtyReqMessage,
        labelKey: ""
      }, "warning"));
    // dispatch(toggleSnackbar(true,
    //   { labelName: "Since Intact quantity is less then the Seized quantity,damage quantity is required at items " + finalcommaseperatedItem, labelKey: "" },
    //   "warning"));
  } else if (!isremarkavailable) {
    let remarkReqMessage = getTextToLocalSeizedItemDetailHeader("remarkRequired") + " " + finalcommaseperatedItem;
    dispatch(toggleSnackbar(true,
      {
        labelName: remarkReqMessage,
        labelKey: ""
      }, "warning"));
    // dispatch(toggleSnackbar(true,
    //   { labelName: "Remark is required at items " + finalcommaseperatedItem, labelKey: "" },
    //   "warning"));
  } else if (issumlessthenseizedqty) {
    let intactDamageMessage = getTextToLocalSeizedItemDetailHeader("intactDamageQtyNotEqual") + " " + finalcommaseperatedItem;
    dispatch(toggleSnackbar(true,
      {
        labelName: intactDamageMessage,
        labelKey: ""
      }, "warning"));
  } else if (isdamageqtyavailable) {
    showHideAdhocPopupForwardUploadDocs(state, dispatch, "search-preview")
    set(state,
      "screenConfiguration.preparedFinalObject.violationDocuments",
      ""
    )
  }
  else if (!isdamageqtyavailable && isIntactqtyavailable && isremarkavailable) {
    dispatch(toggleSpinner());
    let response = await addToStoreViolationData(state, dispatch, isVerified);
    store.dispatch(toggleSpinner());
    let responseStatus = get(response, "status", "");
    if (responseStatus == "SUCCESS" || responseStatus == "success") {
      let successMessage = getTextToLocalSeizedItemDetailHeader("challanVerified");
      dispatch(toggleSnackbar(true,
        {
          labelName: successMessage,
          labelKey: ""
        }, "success"));
      // dispatch(toggleSnackbar(true, {
      //   labelName: 'challan Verified and Updated to Store successfully!',
      //   labelKey: "", //"EC_SUCCESS_TOASTER"
      // }, "success"));
    }
    else {
      let errorMessage = getTextToLocalSeizedItemDetailHeader("challanVerifiedFail");
      dispatch(toggleSnackbar(true,
        {
          labelName: errorMessage,
          labelKey: ""
        }, "error"));
      // dispatch(toggleSnackbar(true, {
      //   labelName: 'challan Verification and Updation failed!. Please try after some time',
      //   labelKey: "", //"EC_SUCCESS_TOASTER"
      // }, "error"));
    }
    callbackforsearchPreviewAction(state, dispatch);
  }
}

const callBackForwardUpload = async (state, dispatch) => {
  showHideAdhocPopupForwardUploadDocs(state, dispatch, "search-preview");
}

const receivePayment = async (state, dispatch) => {
  let violationDate = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].violationDate', '');
  let encroachmentType = new Date(get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentType', ''));

  if (getDiffernceBetweenTodayDate(violationDate) <= 30) {
    callReceivePayment(state, dispatch);
  } else {
    if (encroachmentType === 'Seizure of Vehicles' && getDiffernceBetweenTodayDate(violationDate) <= 365) {
      callReceivePayment(state, dispatch);
    } else if (encroachmentType === 'Seizure of Vehicles' && getDiffernceBetweenTodayDate(violationDate) > 365) {
      dispatch(toggleSnackbar(
        true,
        {
          labelName: "Payment cannot be made after 365 days of voilation date",
          labelKey: ""
        },
        "warning"
      ));
    } else {

      dispatch(toggleSnackbar(
        true,
        {
          labelName: "Payment cannot be made after 30 days of voilation date",
          labelKey: "EC_VEHICLE_PAYMENT_30_DAYS"
        },
        "warning"
      ));
    }
  }
};

const callReceivePayment = (state, dispatch) => {
  let challanamount = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].totalChallanAmount', 0);
  dispatch(prepareFinalObject("eChallanReceivePayament[0].date", convertEpochToDate(new Date())));
  dispatch(prepareFinalObject("eChallanReceivePayament[0].receiveamount", challanamount));
  dispatch(
    handleField(
      "search-preview",
      "components.receivePayment.children.popup.children.receivePaymentCard.children.receivePaymentContainer.children.receivePaymentDateField",
      "props.disabled",
      true)
  );

  dispatch(
    handleField(
      "search-preview",
      "components.receivePayment.children.popup.children.receivePaymentCard.children.receivePaymentContainer.children.receivePaymentAmountField",
      "props.disabled", true)
  );

  showHideAdhocPopupReceivePayment(state, dispatch, "search-preview", "receivePayment");
};


export const footer = getCommonApplyFooter({
  cancelButton: {
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

      },
    },
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12,
    },
    children: {
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      cancelButtonLabel: getLabel({
        labelName: "BACK",
        labelKey: "EC_ECHALLAN_COMMON_BUTTON_BACK"
      }),

    },
    onClickDefination: {
      action: "condition",
      callBack: callbackforsearchPreviewAction
    }
  },
  onGroundPaymentButton: {
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
      onGroundPaymentButtonLabel: getLabel({
        labelName: "ON GROUND PAYMENT",
        labelKey: "EC_ECHALLAN_ON_GROUND_PAYMENT_BUTTON"
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
      callBack: updateonGroundPayment
    },
    visible: false,
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanSI"]
    }
  },
  sendtoSoreButton: {
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
      sendtoSoreButtonLabel: getLabel({
        labelName: "SEND TO STORE",
        labelKey: "EC_ECHALLAN_SEND_TO_STORE_BUTTON"
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
      callBack: updateonSentToStore
    },
    visible: false,
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanSI"]
    }
  },

  StoreManagerReceivePaymentProcess: {
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
      ForwardButtonLabel: getLabel({
        labelName: "Make Payment",
        labelKey: "EC_ECHALLAN_SM_MAKE_PAYMENT_BUTTON"
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
      callBack: (state, dispatch) =>
        receivePayment(state, dispatch, "")
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanSM"]
    },
    visible: enableButton === true ? paymentStatus === 'PAID' ? false : true : false,
  },

  StoreManagerReturnandCloseProcess: {
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
      returnandCloseButtonLabel: getLabel({
        labelName: "Return & Close",
        labelKey: "EC_ECHALLAN_SM_RETURN_CLOSE_BUTTON"
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
      callBack: returnandClosePayment
    },
    visible: false,
      roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanSM"]
    }
  },

  StoreManagerAddToStoreProcess: {
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
      addtoSoreButtonLabel: getLabel({
        labelName: "Forward",
        labelKey: "EC_ECHALLAN_SM_ADD_TO_STORE_BUTTON"
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
      callBack: (state, dispatch) =>
        callBackAddToStore(state, dispatch, true)
    },
    visible: false,
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanSM"]
    }
  },

  StoreManagerHODApprovalProcess: {
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
      ForwardButtonLabel: getLabel({
        labelName: "SENT to HOD APPROVAL",
        labelKey: "EC_ECHALLAN_SM_FORWARD_BUTTON"
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
      callBack: (state, dispatch) =>
        callBackForwardUpload(state, dispatch)
      //callBackForwardAddToStore(state, dispatch, false)
    },
    visible: false,
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanSM"]
    }
  },

  auctionButton: {
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
    visible: false,
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanSM"],
      action: "AUCTION"
    },
    visible: true
  },
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