import {
    getCommonContainer,
    getCommonHeader,
    getCommonCard,
    getCommonTitle
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { footer, callPGService } from "../rented-properties/payResource/footer";
  import estimateDetails from "../rented-properties/payResource/estimate-details";
  import {
    getQueryArg,
    setBusinessServiceDataToLocalStorage
  } from "egov-ui-framework/ui-utils/commons";
  import { fetchBill } from "../utils";
  import set from "lodash/set";
  import { getPaymentGateways } from "../../../../ui-utils/commons";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { BILLING_BUSINESS_SERVICE_OT, BILLING_BUSINESS_SERVICE_DC, BILLING_BUSINESS_SERVICE_RENT } from "../../../../ui-constants";

  const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Application for Ownership Transfer",
      labelKey: "COMMON_PAY_OWNERSHIP_SCREEN_HEADER"
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-rented-properties",
      componentPath: "ApplicationNoContainer",
      props: {
        number: getQueryArg(window.location.href, "consumerCode")
      }
    }
  });
  
  const setPaymentMethods = async (action, state, dispatch) => {
    const businessService = getQueryArg(window.location.href, "businessService") || BILLING_BUSINESS_SERVICE_RENT
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
    const consumerCode = getQueryArg(window.location.href, "consumerCode");
      const businessService = getQueryArg(window.location.href, "businessService")
      const queryObject = [
        { key: "tenantId", value: tenantId },
        { key: "businessServices", value: businessService }
      ];
      setPaymentMethods(action, state, dispatch)
      // setBusinessServiceDataToLocalStorage(queryObject, dispatch);
      await fetchBill(action, state, dispatch, businessService);
      let sourceJsonPath, header;
      switch(businessService) {
        case BILLING_BUSINESS_SERVICE_OT : {
          sourceJsonPath = "OwnersTemp[0].estimateCardData"
          header = getCommonHeader({
            labelName: "Application for Ownership Transfer",
            labelKey: "COMMON_PAY_OWNERSHIP_SCREEN_HEADER"
          })
          break
        }
        case BILLING_BUSINESS_SERVICE_DC: {
          sourceJsonPath = "DuplicateTemp[0].estimateCardData"
          header = getCommonHeader({
            labelName: "Application for Ownership Transfer",
            labelKey: "COMMON_PAY_OWNERSHIP_SCREEN_HEADER"
          })
          break
        }
        case BILLING_BUSINESS_SERVICE_RENT:
        default:  
        {
          sourceJsonPath = "PropertiesTemp[0].estimateCardData"
          header = getCommonHeader({
            labelName: "Online Rent Payment",
            labelKey: "COMMON_PAY_ONLINE_RENT_SCREEN_HEADER"
          })
          break
        }
      }
      dispatch(
        handleField(
            "pay",
            "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children",
            "estimateDetails",
            estimateDetails(sourceJsonPath)
        )
    );
    dispatch(
      handleField(
        "pay",
        "components.div.children.headerDiv.children.header.children",
        "header",
         header
      )
    )
    dispatch(
      handleField(
        "pay",
        "components.div.children.headerDiv.children.header.children.applicationNumber.props",
        "number",
        consumerCode
      )
    )
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
                // estimateDetails
              })
            }
          },
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  