import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../../ui-utils/api";
import {
  getSearchResults,
  getSearchResultsView,
} from "../../../../../ui-utils/commons";
import {
  convertDateToEpoch,
  getBill,
  validateFields,
  showHideAdhocPopup,
} from "../../utils";
import {
  getTenantId,
  localStorageSet,
  getapplicationType,
  getUserInfo,
} from "egov-ui-kit/utils/localStorageUtils";
import {
  checkAvaialbilityAtSubmitCgb,
  checkAvaialbilityAtSubmitOsujm,
  checkAvaialbilityAtSubmit,
} from "../../utils";


export const selectPG = async (state, dispatch) => {
  showHideAdhocPopup(state, dispatch, "pay");
};

export const callPGService = async (state, dispatch, item) => {
  const bookingData = get(
    state,
    "screenConfiguration.preparedFinalObject.Booking"
  );
  const businessService = getQueryArg(window.location.href, "businessService");
  // const tenantId = getQueryArg(window.location.href, "tenantId");
  const tenantId = process.env.REACT_APP_NAME === "Citizen" ? JSON.parse(getUserInfo()).permanentCity : getTenantId();
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  const isAvailable = await checkAvaialbilityAtSubmit(bookingData, dispatch);
  console.log(isAvailable, "isAvailable");
  if (isAvailable) {
    let callbackUrl = `${
      process.env.NODE_ENV === "production"
        ? `${window.origin}/citizen`
        : window.origin
    }/egov-services/paymentRedirectPage`;

    // console.log(callbackUrl, "callbackUrl");
    try {
      const queryObj = [
        { key: "tenantId", value: tenantId },
        { key: "consumerCode", value: applicationNumber },
        { key: "businessService", value: businessService },
      ];

      const taxAmount = get(
        state,
        "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].totalAmount"
      );
      const billId = get(
        state,
        "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].id"
      );
      const consumerCode = get(
        state,
        "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].consumerCode"
      );
      const Accountdetails = get(
        state,
        "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].billAccountDetails"
      );

      const taxAndPayments = [
        {
          amountPaid: taxAmount,
          billId: billId,
        },
      ];

      try {
        const userMobileNumber = get(state, "auth.userInfo.mobileNumber");
        const userName = get(state, "auth.userInfo.name");
        const requestBody = {
          Transaction: {
            tenantId,
            billId: billId, // get(billPayload, "Bill[0].id"),
            txnAmount: taxAmount, //get(billPayload, "Bill[0].totalAmount"),
            module:businessService, 
            taxAndPayments,
            consumerCode: consumerCode, // get(billPayload, "Bill[0].consumerCode"),
            productInfo: businessService, // "Property Tax Payment",
            gateway: item,
            user: get(state, "auth.userInfo"),
            callbackUrl,
          },
        };

        const goToPaymentGateway = await httpRequest(
          "post",
          "pg-service/transaction/v1/_create",
          "_create",
          [],
          requestBody
        );
        const redirectionUrl = get(
          goToPaymentGateway,
          "Transaction.redirectUrl"
        );
        window.location = redirectionUrl;
      } catch (e) {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: `A transaction for ${applicationNumber} has been abruptly discarded, please retry after 30 mins`,
              labelKey: "",
            },
            "error"
          )
        );
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Selected Dates are Already Booked. Try Again!",
          labelKey: "",
        },
        "warning"
      )
    );
 
  }
};

const convertDateFieldToEpoch = (finalObj, jsonPath) => {
  const dateConvertedToEpoch = convertDateToEpoch(
    get(finalObj, jsonPath),
    "daystart"
  );
  set(finalObj, jsonPath, dateConvertedToEpoch);
};

const allDateToEpoch = (finalObj, jsonPaths) => {
  jsonPaths.forEach((jsonPath) => {
    if (get(finalObj, jsonPath)) {
      convertDateFieldToEpoch(finalObj, jsonPath);
    }
  });
};

export const getCommonApplyFooter = (children) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
      style: { display: "flex", justifyContent: "flex-end" },
    },
    children,
  };
};

export const footer = getCommonApplyFooter({
  makePayment: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-services",
    componentPath: "MenuButton",
    props: {
      data: {
        label: {
          labelName: "MAKE PAYMENT",
          labelKey: "COMMON_MAKE_PAYMENT",
        },
        rightIcon: "arrow_drop_down",
        props: {
          variant: "outlined",
          style: {
            marginLeft: 5,
            marginRight: 15,
            backgroundColor: "#FE7A51",
            color: "#fff",
            border: "none",
            height: "60px",
            width: "250px",
          },
        },
        menu: [],
      },
    },
  },
});
