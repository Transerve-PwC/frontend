import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getCommonTitle,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getCurrentFinancialYear, generateBill, showHideAdhocPopup } from "../utils";
import { paymentGatewaySelectionPopup } from "./payResource/adhocPopup";
import estimateDetails from "./payResource/estimate-details";
import { footer } from "./payResource/footer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
import { getapplicationType,getEncroachmentType } from "egov-ui-kit/utils/localStorageUtils";


const header = getCommonContainer({
  header: getCommonHeader({
    //labelName: `Application for ${getapplicationType()} - (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    //labelKey: "NOC_COMMON_APPLY_NOC"
    labelName: `${getEncroachmentType()} -- (${getCurrentFinancialYear()})` //later use getFinancialYearDates
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-echallan",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    }
  }
});

const getPaymentGatwayList = async (action, state, dispatch) => {
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
          element : element
        }
        payloadprocess.push(pay);
      }

    dispatch(prepareFinalObject("applyScreenMdmsData.payment", payloadprocess));
    
  } catch (e) {
    console.log(e);
  }
};



const screenConfig = {
  uiFramework: "material-ui",
  name: "pay",
  beforeInitScreen: (action, state, dispatch) => {
    getPaymentGatwayList(action, state, dispatch).then(response => {
    });
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        //id: "pay"
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
                labelName: "Payment Collection Details",
                labelKey: "EC_CITIZEN_PAYMENT_HEAD"
              }),
              estimateDetails,
              addPenaltyRebateButton: {
                componentPath: "Button",
                props: {
                  color: "primary",
                  style: {}
                },
                onClickDefination: {
                  action: "condition",
                  callBack: (state, dispatch) => showHideAdhocPopup(state, dispatch, "pay")
                }
              },
            })
          }
        },
        footer:footer
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-echallan",
      componentPath: "PopupContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "pay"
      },
      children: {
        popup: paymentGatewaySelectionPopup
      }
    }
  }
};

export default screenConfig;
