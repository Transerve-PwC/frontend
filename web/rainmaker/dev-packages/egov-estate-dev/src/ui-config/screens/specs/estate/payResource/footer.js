import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils/api";
import {
  getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getBill, validateFields } from "../../utils";
import {
    getUserInfo,
  } from "egov-ui-kit/utils/localStorageUtils";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

export const callPGService = async (state, dispatch, item, _businessService) => {
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const consumerCode = getQueryArg(window.location.href, "consumerCode");
  let callbackUrl = `${document.location.origin}${
    process.env.NODE_ENV === "production" ? "/citizen" : ""
  }/estate-citizen/PaymentRedirectPage`;
//   const _businessService = get(state.screenConfiguration.preparedFinalObject, "Licenses[0].businessService", "");
  try {
    const queryObj = [
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "consumerCode",
        value: consumerCode
      },
      {
        key: "businessService",
        value: _businessService
      }
    ];

  const billPayload = await getBill(queryObj);

  const taxAmount = Number(get(billPayload, "Bill[0].totalAmount"));
  // let amtToPay =
  //   state.screenConfiguration.preparedFinalObject.AmountType ===
  //   "partial_amount"
  //     ? state.screenConfiguration.preparedFinalObject.AmountPaid
  //     : taxAmount;
  // amtToPay = amtToPay ? Number(amtToPay) : taxAmount;
  const amtToPay = Number(taxAmount)

  // if(amtToPay>taxAmount&&!isAdvancePaymentAllowed){
  //   alert("Advance Payment is not allowed");
  //   return;
  // }

  let userInfo = JSON.parse(getUserInfo());

  const user = {
    name: get(billPayload, "Bill[0].payerName"),
    mobileNumber: userInfo.userName,
    // mobileNumber: get(billPayload, "Bill[0].mobileNumber"),
    tenantId
  };
  const businessService = get(billPayload, "Bill[0].businessService")
  let taxAndPayments = [];
  taxAndPayments.push({
    // taxAmount:taxAmount,
    // businessService: businessService,
    billId: get(billPayload, "Bill[0].id"),
    amountPaid: amtToPay
  });

  try {
    const requestBody = {
      Transaction: {
        tenantId,
        txnAmount: amtToPay,
        module: businessService,
        billId: get(billPayload, "Bill[0].id"),
        consumerCode: consumerCode,
        productInfo: "Common Payment",
        gateway: item,
        taxAndPayments,
        user,
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


    if (get(goToPaymentGateway, "Transaction.txnAmount") == 0) {
      const srcQuery = `?tenantId=${get(
        goToPaymentGateway,
        "Transaction.tenantId"
      )}&billIds=${get(goToPaymentGateway, "Transaction.billId")}`;

      let searchResponse = await httpRequest(
        "post",
        "collection-services/payments/_search" + srcQuery,
        "_search",
        [],
        {}
      );

      let transactionId = get(
        searchResponse,
        "Payments[0].paymentDetails[0].receiptNumber"
      );
     
      dispatch(
        setRoute(
          `/estate/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`
        )
      );
    } else {
      const redirectionUrl =
        get(goToPaymentGateway, "Transaction.redirectUrl") ||
        get(goToPaymentGateway, "Transaction.callbackUrl");
      window.location = redirectionUrl;
    }
  } catch (e) {
    console.log(e);
    if (e.message === "A transaction for this bill has been abruptly discarded, please retry after 30 mins"){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: e.message, labelKey: e.message },
          "error"
        )
      );
    }else{
      moveToFailure(dispatch);
    }
  }
} catch (error) {
  console.log(error);
}
};

const moveToFailure = dispatch => {
  const consumerCode = getQueryArg(window.location, "consumerCode");
  const tenantId = getQueryArg(window.location, "tenantId");
  const businessService = getQueryArg(window.location, "businessService")
  const status = "failure";
  const purpose = "pay";
  // const appendUrl =
  //   process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  dispatch(
    setRoute(
      `/estate/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${consumerCode}&tenantId=${tenantId}&businessService=${businessService}`
    )
  );
};

export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
      style: { display: "flex", justifyContent: "flex-end" }
    },
    children
  };
};

const callBackForOfflinePayment = async (state, dispatch) => {
  let isValid = true;
  isValid = validateFields("components.div.children.formwizardFirstStep.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children", state, dispatch, "pay")
  if(isValid) {
    const applicationNumber = getQueryArg(window.location.href, "consumerCode")
    const tenantId = getTenantId()
    const type = getQueryArg(window.location.href, "businessService")
    const paymentDetails = get(state, "screenConfiguration.preparedFinalObject.payment")
    const estimateDetails = get(state, "screenConfiguration.preparedFinalObject.temp[0].estimateCardData")
    const tax = estimateDetails.find(item => item.name.labelKey.includes("TAX"));
    const non_tax = estimateDetails.filter(item => !item.name.labelKey.includes("TAX"))
    const paymentAmount = non_tax.reduce((prev, curr)=> prev + Number(curr.value) ,0)
    const gst = !!tax ? tax.value : 0
    const payload = [{...paymentDetails, paymentAmount, gst: Number(gst), applicationNumber, tenantId}]
    try {
      const response = await httpRequest("post",
      "/est-services/application/_collect_payment",
      "",
      [],
      { Applications : payload })
      if(!!response) {
        const path = `/estate/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${type}`
        dispatch(
          setRoute(path)
        );
      }
    } catch (error) {
      console.log("error", error)
    }
  }
}

export const footer = getCommonApplyFooter({
  makePayment: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-estate",
    componentPath: "MenuButton",
    visible: process.env.REACT_APP_NAME === "Citizen",
    props: {
      data: {
        label: {labelName : "MAKE PAYMENT" , labelKey :"COMMON_MAKE_PAYMENT"},
        rightIcon: "arrow_drop_down",
        props: { variant: "outlined", 
        style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" } },
        menu: []
      }
    },
  },
  paymentButton: {
    componentPath: "Button",
    visible: process.env.REACT_APP_NAME !== "Citizen",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit"
      }
    },
    children: {
          submitButtonLabel: getLabel({
            labelName: "MAKE PAYMENT",
            labelKey: "COMMON_MAKE_PAYMENT"
          })
        },
    onClickDefination: {
      action: "condition",
      callBack: callBackForOfflinePayment
    },
  }
});