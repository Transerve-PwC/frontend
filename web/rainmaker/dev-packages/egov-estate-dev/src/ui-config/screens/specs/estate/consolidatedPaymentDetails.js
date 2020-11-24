import {
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults ,setXLSTableData } from "../../../../ui-utils/commons";
import {getReviewPayment} from './preview-resource/payment-details'
import {onTabChange, headerrow, tabs} from './search-preview'
// import {paymentDetailsTable} from './applyResource/applyConfig'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getReviewConsolidatedPaymentDetails} from "./applyResource/reviewProperty"

let isPropertyMasterOrAllotmentOfSite;

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  if(fileNumber){
      let queryObject = [
          { key: "fileNumber", value: fileNumber }
        ];
   const response =  await getSearchResults(queryObject)
    if(!!response) {
      // let {estateDemands, estatePayments} = response.Properties[0].propertyDetails;
      // estateDemands = estateDemands || []
      // estatePayments = estatePayments || []
      // setXLSTableData({demands:estateDemands,payments:estatePayments, componentJsonPath: "components.div.children.paymentDetailsTable", screenKey: "payment-details"})
      let properties = response.Properties;
      let propertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
      dispatch(prepareFinalObject("Properties[0]", properties[0]));

      dispatch(
        handleField(
          action.screenKey,
          "components.div.children.tabSection",
          "props.tabs",
          (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? tabs : tabsAllotment
        )
      )

      dispatch(
        handleField(
          "payment-details",
          "components.div.children.reviewConsolidatedPayments",
          "visible",
          !!(propertyMasterOrAllotmentOfSite == "PROPERTY_MASTER")
        )
      )
    }
  }
}


const consolidatedPaymentDetails = {
  uiFramework: "material-ui",
  name: "consolidatedPayment",
  beforeInitScreen: (action, state, dispatch) => {
    const fileNumber = getQueryArg(window.location.href, "fileNumber");
    beforeInitFn(action, state, dispatch, fileNumber);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
             ...headerrow
            },
            }
          },
          tabSection: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-estate",
            componentPath: "CustomTabContainer",
            props: {
              tabs,
              activeIndex: 6,
              onTabChange
            },
            type: "array",
          },
          breakAfterSearch: getBreak(),
          reviewConsolidatedPayments : getCommonCard({
            consolidatedPaymentDetails: getReviewConsolidatedPaymentDetails(false, "apply")
          })
          
      }
    }
  }
};

export default consolidatedPaymentDetails;