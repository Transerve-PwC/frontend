import {
    getCommonHeader,
    getLabel,
    getBreak,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { estateApplication } from './searchResource/estatePaymentApplication';
  import { searchResults } from './estate-payments-searchresults';
  import commonConfig from "config/common.js";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { httpRequest } from "../../../../ui-utils";
  import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { ESTATE_SERVICES_MDMS_MODULE } from "../../../../ui-constants";
  
  const header = getCommonHeader({
    labelName: "Search Property",
    labelKey: "ES_SEARCH_PROPERTY_HEADER"
  });
  
  const getMdmsData = async (dispatch) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [{
          moduleName: ESTATE_SERVICES_MDMS_MODULE,
          masterDetails: [{
            name: "categories"
          }]
        }]
      }
    };
    try {
      let payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      return dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  }
  
  const estatePaymentSearchAndResult = {
    uiFramework: "material-ui",
    name: "estate-payment-search",
    beforeInitScreen: (action, state, dispatch) => {
      state.screenConfiguration.preparedFinalObject.citizenSearchScreen = {}
      getMdmsData(dispatch);
      return action
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "search"
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
          estateApplication,
          breakAfterSearch: getBreak(),
          searchResults
        }
      }
    }
  };
  
  export default estatePaymentSearchAndResult;