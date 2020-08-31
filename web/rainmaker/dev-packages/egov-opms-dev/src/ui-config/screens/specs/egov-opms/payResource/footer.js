import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../../ui-utils/api";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { convertDateToEpoch, getBill, validateFields, showHideAdhocPopup } from "../../utils";
import { getOPMSTenantId, localStorageSet, getapplicationType } from "egov-ui-kit/utils/localStorageUtils";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
const getPaymentGatwayList = async (dispatch) => {
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/pg-service/gateway/v1/_search",
      "_search",
      [],
      {}
    );

    let payloadprocess = [];
    for (let index = 0; index < payload.length; index++) {
      const element = payload[index];
      let pay = {
        element: element
      }
      payloadprocess.push(pay);
    }

    dispatch(prepareFinalObject("applyScreenMdmsData.payment", payloadprocess));
  } catch (e) {
    dispatch(toggleSpinner());
    console.log(e);
  }
};
export const selectPG = async (state, dispatch) => {
  try {
    dispatch(toggleSpinner());
    await getPaymentGatwayList(dispatch).then(response => {
      dispatch(toggleSpinner());
      showHideAdhocPopup(state, dispatch, "pay")
    });
  } catch (e) {
    dispatch(toggleSpinner());
    console.log(e);
  }
};
export const callPGService = async (state, dispatch) => {

  const gateway = get(state, "screenConfiguration.preparedFinalObject.OPMS.paymentGateway");
  if (gateway) {


    const tenantId = getQueryArg(window.location.href, "tenantId");
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );

    //let callbackUrl=`${window.origin}/egov-opms/paymentRedirectPage`;
    let callbackUrl = `${
      process.env.NODE_ENV === "production"
        ? `${window.location.origin}/citizen`
        : window.location.origin
      }/egov-opms/paymentRedirectPage`;

    try {
      const queryObj = [
        { key: "tenantId", value: tenantId },
        { key: "consumerCode", value: applicationNumber },
        //value:"PMS-2020-02-21-041823"
        { key: "businessService", value: "OPMS" }
        //value: applicationNumber
      ];

      const taxAmount = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].totalAmount");
      const billId = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].id");
      const consumerCode = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].consumerCode");
      const Accountdetails = get(state, "screenConfiguration.preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails[0].billAccountDetails");
      const roadcutBusinessServiceCode = get(state, "screenConfiguration.preparedFinalObject.OPMS.RODCUTNOC.BusinessServiceCode");

      localStorageSet("amount", 0);
      localStorageSet("gstAmount", 0);
      localStorageSet("performanceBankGuaranteeCharges", 0);

      for (let index = 0; index < Accountdetails.length; index++) {
        const element = Accountdetails[index];
        if (element.taxHeadCode === `PETNOC_FEE` ||
          element.taxHeadCode === `ROADCUTNOC_FEE_RD1` ||
          element.taxHeadCode === `ROADCUTNOC_FEE_RD2` ||
          element.taxHeadCode === `ROADCUTNOC_FEE_RD3` ||
          element.taxHeadCode === `ADVERTISEMENTNOC_FEE`) {
          localStorageSet("amount", element.amount);
        } else if (element.taxHeadCode === `PETNOC_TAX` ||
          element.taxHeadCode === `ROADCUTNOC_TAX_RD1` ||
          element.taxHeadCode === `ROADCUTNOC_TAX_RD2` ||
          element.taxHeadCode === `ROADCUTNOC_TAX_RD3` ||
          element.taxHeadCode === `ADVERTISEMENTNOC_TAX`) {
          localStorageSet("gstAmount", element.amount);
        } else if (element.taxHeadCode === `ROADCUTNOC_FEE_BANK_RD1`
          || element.taxHeadCode === `ROADCUTNOC_FEE_BANK_RD2`
          || element.taxHeadCode === `ROADCUTNOC_FEE_BANK_RD3`
        ) {
          localStorageSet("performanceBankGuaranteeCharges", element.amount);
        }
      }


      const taxAndPayments = [{
        amountPaid: taxAmount,
        billId: billId
      }]

      try {

        const userMobileNumber = get(state, "auth.userInfo.mobileNumber")
        const userName = get(state, "auth.userInfo.name")
        const requestBody = {
          Transaction: {
            tenantId,
            billId: billId, // get(billPayload, "Bill[0].id"),
            txnAmount: taxAmount, //get(billPayload, "Bill[0].totalAmount"),
            module: getapplicationType() == "ROADCUTNOC" ? roadcutBusinessServiceCode : `OPMS.${getapplicationType()}`,
            taxAndPayments,
            consumerCode: consumerCode, // get(billPayload, "Bill[0].consumerCode"),
            productInfo: getapplicationType(),
            gateway: gateway,
            user: {
              mobileNumber: userMobileNumber,
              name: userName,
              tenantId: getOPMSTenantId(),
            },
            callbackUrl
          }
        };

        const goToPaymentGateway = await httpRequest(
          "post",
          "pg-service/transaction/v1/_create",
          "_create",
          [],
          requestBody
        );

        const redirectionUrl = get(goToPaymentGateway, "Transaction.redirectUrl");
        window.location = redirectionUrl;
      } catch (e) {
        dispatch(toggleSnackbar(true, { labelName: `API ERROR ${e.message}` }, "error"));

        console.log(e);
      }
    } catch (e) {
      dispatch(toggleSnackbar(true, { labelName: `API ERROR ${e.message}` }, "error"));

      console.log(e);
    }
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please Select Gateway To Proceed",
          labelKey: "PM_SELECT_GATEWAY_WARN"
        },
        "warning"
      )
    );


  }
};

const moveToSuccess = (dispatch, receiptNumber) => {
  const applicationNo = getQueryArg(window.location, "applicationNumber");
  const tenantId = getQueryArg(window.location, "tenantId");
  const purpose = "pay";
  const status = "success";
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  dispatch(
    setRoute(
      `${appendUrl}/egov-opms/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}&secondNumber=${receiptNumber}`
    )
  );
};

const getSelectedTabIndex = paymentType => {
  switch (paymentType) {
    case "Cash":
      return {
        selectedPaymentMode: "cash",
        selectedTabIndex: 0,
        fieldsToValidate: ["payeeDetails"]
      };
    case "Cheque":
      return {
        selectedPaymentMode: "cheque",
        selectedTabIndex: 1,
        fieldsToValidate: ["payeeDetails", "chequeDetails"]
      };
    case "DD":
      return {
        selectedPaymentMode: "demandDraft",
        selectedTabIndex: 2,
        fieldsToValidate: ["payeeDetails", "demandDraftDetails"]
      };
    case "Card":
      return {
        selectedPaymentMode: "card",
        selectedTabIndex: 3,
        fieldsToValidate: ["payeeDetails", "cardDetails"]
      };
    default:
      return {
        selectedPaymentMode: "cash",
        selectedTabIndex: 0,
        fieldsToValidate: ["payeeDetails"]
      };
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
  jsonPaths.forEach(jsonPath => {
    if (get(finalObj, jsonPath)) {
      convertDateFieldToEpoch(finalObj, jsonPath);
    }
  });
};

const updatePayAction = async (
  state,
  dispatch,
  applicationNo,
  tenantId,
  receiptNumber
) => {
  try {
    let response = await getSearchResults([
      {
        key: "tenantId",
        value: tenantId
      },
      { key: "applicationNumber", value: applicationNo }
    ]);
    set(response, "OpmsNOCs[0].opmsNOCDetails.action", "PAY");
    response = await httpRequest(
      "post",
      "pm-services/noc/_updateappstatus",
      "",
      [],
      {
        OpmsNOCs: get(response, "OpmsNOCs", [])
      }
    );
    if (get(response, "OpmsNOCs", []).length > 0) {
      moveToSuccess(dispatch, receiptNumber);
    }
  } catch (e) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelKey: e.message },
        "error"
      )
    );
    console.log(e);
  }
};

const callBackForPay = async (state, dispatch) => {
  let isFormValid = true;

  // --- Validation related -----//

  const selectedPaymentType = get(
    state.screenConfiguration.preparedFinalObject,
    "ReceiptTemp[0].instrument.instrumentType.name"
  );
  const {
    selectedTabIndex,
    selectedPaymentMode,
    fieldsToValidate
  } = getSelectedTabIndex(selectedPaymentType);

  isFormValid =
    fieldsToValidate
      .map(curr => {
        return validateFields(
          `components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePaymentDetails.children.cardContent.children.tabSection.props.tabs[${selectedTabIndex}].tabContent.${selectedPaymentMode}.children.${curr}.children`,
          state,
          dispatch,
          "pay"
        );
      })
      .indexOf(false) === -1;
  if (
    get(
      state.screenConfiguration.preparedFinalObject,
      "Bill[0].billDetails[0].manualReceiptDate"
    )
  ) {
    isFormValid = validateFields(
      `components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.g8Details.children.cardContent.children.receiptDetailsCardContainer.children`,
      state,
      dispatch,
      "pay"
    );
  }

  //------------ Validation End -------------//

  //------------- Form related ----------------//

  const ReceiptDataTemp = get(
    state.screenConfiguration.preparedFinalObject,
    "ReceiptTemp[0]"
  );
  let finalReceiptData = cloneDeep(ReceiptDataTemp);

  allDateToEpoch(finalReceiptData, [
    "Bill[0].billDetails[0].manualReceiptDate",
    "instrument.transactionDateInput"
  ]);

  // if (get(finalReceiptData, "Bill[0].billDetails[0].manualReceiptDate")) {
  //   convertDateFieldToEpoch(
  //     finalReceiptData,
  //     "Bill[0].billDetails[0].manualReceiptDate"
  //   );
  // }

  // if (get(finalReceiptData, "instrument.transactionDateInput")) {
  //   convertDateFieldToEpoch(
  //     finalReceiptData,
  //     "Bill[0].billDetails[0].manualReceiptDate"
  //   );
  // }
  if (get(finalReceiptData, "instrument.transactionDateInput")) {
    set(
      finalReceiptData,
      "instrument.instrumentDate",
      get(finalReceiptData, "instrument.transactionDateInput")
    );
  }

  if (get(finalReceiptData, "instrument.transactionNumber")) {
    set(
      finalReceiptData,
      "instrument.instrumentNumber",
      get(finalReceiptData, "instrument.transactionNumber")
    );
  }

  if (selectedPaymentType === "Card") {
    //Extra check - remove once clearing forms onTabChange is fixed
    if (
      get(finalReceiptData, "instrument.transactionNumber") !==
      get(finalReceiptData, "instrument.transactionNumberConfirm")
    ) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Transaction numbers don't match !",
            labelKey: "ERR_TRANSACTION_NO_DONT_MATCH"
          },
          "error"
        )
      );
      return;
    }
  }

  //------------- Form End ----------------//

  let ReceiptBody = {
    Receipt: []
  };

  ReceiptBody.Receipt.push(finalReceiptData);

  // console.log(ReceiptBody);

  //---------------- Create Receipt ------------------//
  if (isFormValid) {
    try {
      let response = await httpRequest(
        "post",
        "collection-services/receipts/_create",
        "_create",
        [], ReceiptBody, [], {});

      let receiptNumber = get(
        response,
        "Receipt[0].Bill[0].billDetails[0].receiptNumber",
        null
      );

      // Search NOC application and update action to PAY
      const applicationNo = getQueryArg(window.location, "applicationNumber");
      const tenantId = getQueryArg(window.location, "tenantId");
      await updatePayAction(
        state,
        dispatch,
        applicationNo,
        tenantId,
        receiptNumber
      );
    } catch (e) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: e.message, labelKey: e.message },
          "error"
        )
      );
      console.log(e);
    }
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill all the mandatory fields",
          labelKey: "ERR_FILL_ALL_FIELDS"
        },
        "warning"
      )
    );
  }
};

export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const footer = getCommonApplyFooter({
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        //  minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "NOC_COMMON_BUTTON_SUBMIT"
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
      callBack: callBackForPay
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["NOC_CEMP"],
      action: "PAY"
    },
    visible: process.env.REACT_APP_NAME === "Citizen" ? false : true
  },
  makePayment: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        //  minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "NOC_COMMON_BUTTON_MAKE_PAYMENT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: selectPG
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["CITIZEN"],
      action: "PAY"
    },
    visible: process.env.REACT_APP_NAME === "Citizen" ? true : false
  }
});
