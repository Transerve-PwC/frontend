import {
  getCommonContainer,
  getCommonHeader,
  getCommonCard,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { footer, callPGService } from "../tradelicence/payResource/footer";
import estimateDetails from "../tradelicence/payResource/estimate-details";
import {
  getQueryArg,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { fetchBill } from "../utils";
import set from "lodash/set";
import { getPaymentGateways } from "../../../../ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";

const header = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application for New Trade License (2018-2019)",
    labelKey: "COMMON_PAY_SCREEN_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-tradelicence",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "consumerCode")
    }
  }
});

const setPaymentMethods = async (action, state, dispatch) => {
  const response = await getPaymentGateways();
  if(!!response.length) {
    const paymentMethods = response.map(item => ({
      label: { labelName: item,
      labelKey: item},
      link: () => callPGService(state, dispatch, item)
    }))
    set(action, "screenConfig.components.div.children.footer.children.makePayment.props.data.menu", paymentMethods)
  }
}

const beforeScreenInit = async(action, state, dispatch) => {
  const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: "NewTL" }
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    await fetchBill(action, state, dispatch);
    setPaymentMethods(action, state, dispatch)
    const estimateCardData = get(state.screenConfiguration, "preparedFinalObject.LicensesTemp[0].estimateCardData") || [];
    const showPaymentButton = estimateCardData.some(item => !!Number(item.value))
    dispatch(
      handleField(
        "pay",
        "components.div.children.footer.children.makePayment",
        "visible",
        showPaymentButton
      )
    );
    dispatch(
      handleField(
        "pay",
        "components.div.children.footer.children.errorButton",
        "visible",
        !showPaymentButton
      )
    );
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "pay",
  beforeInitScreen: (action, state, dispatch) => {
    beforeScreenInit(action, state, dispatch)
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css citizen-payment-confirmation"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        formwizardFirstStep: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            paymentDetails: getCommonCard({
              header: getCommonTitle({
                labelName: "Please review your fee and proceed to payment",
                labelKey: "NOC_PAYMENT_HEAD"
              }),
              estimateDetails
            })
          }
        },
        footer
      }
    }
  }
};

export default screenConfig;
