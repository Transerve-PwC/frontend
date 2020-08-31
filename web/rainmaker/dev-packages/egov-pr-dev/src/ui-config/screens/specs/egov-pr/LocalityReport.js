import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {
    getFileUrlFromAPI,
    getQueryArg,
    getTransformedLocale,
    setBusinessServiceDataToLocalStorage
  } from "egov-ui-framework/ui-utils/commons";
  import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
  import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
  import jp from "jsonpath";
  import get from "lodash/get";
  import set from "lodash/set";
 
  import { LocalityWiseReport } from "./searchResource/Report";
  import { LocalityReportSearchResults } from "./searchResource/searchResults";
  
  import {
    applicantSummary,
    institutionSummary
  } from "./summaryResource/applicantSummary";

   
  const screenConfig = {
    uiFramework: "material-ui",
    name: "LocalityReport",
    beforeInitScreen: (action, state, dispatch) => {
          return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
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
               // ...titlebar
              }
            }
          },
         
          body: getCommonCard({
           report:LocalityWiseReport,
           LocalityReportSearchResults
          }),
         
        }
      }
    }
  };
  
  export default screenConfig;
  