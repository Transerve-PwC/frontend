import {
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults ,setXLSTableData } from "../../../../ui-utils/commons";
import {getReviewPayment} from './preview-resource/payment-details'
import {onTabChange, headerrow, tabs} from './search-preview'
// import {paymentDetailsTable} from './applyResource/applyConfig'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getReviewConsolidatedPaymentDetails} from "./applyResource/reviewProperty";
import get from "lodash/get";

let isPropertyMasterOrAllotmentOfSite;
let branchTabs = tabs;
let activeIndex = 6;

const getData = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber){
    // await searchResults(action, state, dispatch, fileNumber)
    let queryObject = [
      { key: "fileNumber", value: fileNumber },
      {key: "relations", value: "court"}
    ];
    const response =  await getSearchResults(queryObject)
    if(!!response) {
      let properties = response.Properties;
      isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
      dispatch(prepareFinalObject("Properties[0]", properties[0]));

      return {
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
                  tabs: branchTabs,
                  activeIndex: activeIndex,
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
    }
  }
  
}

const updateAllFields = (action, state, dispatch) => {
  const properties = get(state, "screenConfiguration.preparedFinalObject.Properties");
}

const commonConsolidatedPayment = {
  uiFramework: "material-ui",
  name: "consolidatedPaymentDetails",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
      const fileNumber = getQueryArg(window.location.href, "fileNumber");
      dispatch(toggleSpinner())
      const components = await getData(action, state, dispatch, fileNumber)
      dispatch(toggleSpinner())
      setTimeout(() => updateAllFields(action, state, dispatch), 100)
      return {
        "type": "INIT_SCREEN",
        "screenKey": "consolidatedPaymentDetails",
        "screenConfig": {
          "uiFramework": "material-ui",
          "name": "consolidatedPaymentDetails",
          components
        }
      }
  }
}


export default commonConsolidatedPayment;