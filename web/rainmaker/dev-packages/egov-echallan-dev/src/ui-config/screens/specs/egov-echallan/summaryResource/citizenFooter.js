import {
   getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";
  import { getCommonApplyFooter, getDiffernceBetweenTodayDate } from "../../utils";
  import {  getUserInfo} from "egov-ui-kit/utils/localStorageUtils";
  import "./index.css";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

  let roles = JSON.parse(getUserInfo()).roles;

  //alert('CITIZEN');
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  const callbackforsummaryaction = async (state, dispatch) => {
    const appendUrl =
      process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
    const reviewUrl = `${appendUrl}/egov-echallan/my-challans`;
    dispatch(setRoute(reviewUrl));
  
  };
  
  const callbackforsummaryactionpay = async (state, dispatch) => {
  
    const applicationid = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let appStatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].status", '');
    let paymentStatus = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].paymentDetails.paymentStatus", 'PENDING');
    let encroachmentType = get(state, 'screenConfiguration.preparedFinalObject.eChallanDetail[0].encroachmentType', '');
  
    if (appStatus !== ('RELEASED FROM STORE' || 'RELEASED ON GROUND' || 'CLOSED') && paymentStatus === 'PENDING') {
      //make payment code
      let violationDate = get(state, "screenConfiguration.preparedFinalObject.eChallanDetail[0].violationDate", new Date());
  
      if (getDiffernceBetweenTodayDate(violationDate) <= 30) {
        const appendUrl =
          process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
        const reviewUrl = `${appendUrl}/egov-echallan/pay?applicationNumber=${applicationid}&tenantId=${tenantId}`;
        dispatch(setRoute(reviewUrl));
  
      } else {
        // alert("on else search")
        if (encroachmentType === 'Seizure of Vehicles' && getDiffernceBetweenTodayDate(violationDate) <= 365) {
          const appendUrl =
            process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
          const reviewUrl = `${appendUrl}/egov-echallan/pay?applicationNumber=${applicationid}&tenantId=${tenantId}`;
          dispatch(setRoute(reviewUrl));
        } else if (encroachmentType === 'Seizure of Vehicles' && getDiffernceBetweenTodayDate(violationDate) > 365) {
          dispatch(toggleSnackbar(
            true,
            {
              labelName: "Payment cannot be made after 365 days of voilation date",
              labelKey: "EC_VEHICLE_PAYMENT_365_DAYS"
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
    } else if (paymentStatus === 'PAID') {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "You have already paid for this Challan", labelKey: "TOASTER_SEARCH_PREVIEW_PAYMENT_SUCCESS" },
          "success"
        )
      );
    }
  
  }
  export const titlebarfooter = getCommonApplyFooter({
    previousButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          height: "48px",
          marginRight: "16px",
          minWidth: "200px"
  
  
        }
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
          marginRight: "16px"
        }
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "Make Payment",
          labelKey: "EC_PAYMENT_BUTTON"
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
        callBack: callbackforsummaryactionpay
      },
      roleDefination: {
        rolePath: "user-info.roles",
        roles: ["CITIZEN", "challanSI"],
        action: "PAY"
      },
      visible: process.env.REACT_APP_NAME === "Citizen" ? true : false
    }
  });