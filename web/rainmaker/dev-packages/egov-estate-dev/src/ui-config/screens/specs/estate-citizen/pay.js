import {
    getCommonContainer,
    getCommonHeader,
    getCommonCard,
    getCommonTitle
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { footer, callPGService } from "../estate/payResource/footer";
  import {
    getQueryArg,
    setBusinessServiceDataToLocalStorage
  } from "egov-ui-framework/ui-utils/commons";
  import { fetchBill, getFeesEstimateCard } from "../utils";
  import set from "lodash/set";
  import { getPaymentGateways } from "../../../../ui-utils/commons";

  const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Estate branch Application",
      labelKey: "ES_APPLICATION_PAYMENT"
    })
  });
  
  const setPaymentMethods = async (action, state, dispatch) => {
    const businessService = getQueryArg(window.location.href, "businessService")
    const response = await getPaymentGateways();
    if(!!response.length) {
      const paymentMethods = response.map(item => ({
        label: { labelName: item,
        labelKey: item},
        link: () => callPGService(state, dispatch, item, businessService)
      }))
      set(action, "screenConfig.components.div.children.footer.children.makePayment.props.data.menu", paymentMethods)
    }
  }

  const beforeScreenInit = async (action, state, dispatch) => {
      const tenantId = getQueryArg(window.location.href, "tenantId");
      const businessService = getQueryArg(window.location.href, "businessService")
      const queryObject = [
        { key: "tenantId", value: tenantId },
        { key: "businessServices", value: businessService }
      ];
      setPaymentMethods(action, state, dispatch)
      // setBusinessServiceDataToLocalStorage(queryObject, dispatch);
      await fetchBill(action, state, dispatch);
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
                  labelKey: "ES_PAYMENT_HEAD"
                }),
                estimateDetails : getFeesEstimateCard({
                    sourceJsonPath: "temp[0].estimateCardData"
                  })
              })
            }
          },
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  