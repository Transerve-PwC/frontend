import {
    getCommonCard,getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults ,setXLSTableData } from "../../../../ui-utils/commons";
import {getReviewPayment} from './preview-resource/payment-details'
import {onTabChange, headerrow, tabs} from './estate-payment'
import {paymentDetailsTable} from './applyResource/applyConfig'
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {penaltyDetailsTable} from "./searchResource/searchResults"

const header = getCommonHeader({
  labelName: "Penalty",
  labelKey: "ES_PENALTY_STATEMENT"
});

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
//   if(fileNumber){
//       let queryObject = [
//           { key: "fileNumber", value: fileNumber }
//         ];
//    const response =  await getSearchResults(queryObject);
//     if(!!response) {
//       let {estateDemands, estatePayments} = response.Properties[0].propertyDetails;
//       estateDemands = estateDemands || []
//       estatePayments = estatePayments || []
//       setXLSTableData({demands:estateDemands,payments:estatePayments, componentJsonPath: "components.div.children.paymentDetailsTable", screenKey: "payment-details"})
//     }
//   }
}


const penaltyStatementDetails = {
  uiFramework: "material-ui",
  name: "penaltyStatement",
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
            header: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
             ...header
            },
            }
          },
          tabSection: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-estate",
            componentPath: "CustomTabContainer",
            props: {
              tabs,
              activeIndex: 1,
              onTabChange
            },
            type: "array",
          },
          breakAfterSearch: getBreak(),
          penaltyDetailsTable
      }
    }
  }
};

export default penaltyStatementDetails;