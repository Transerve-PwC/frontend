import {
    getCommonHeader,
    getBreak,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { accountStatementFilterForm } from "./searchResource/rentedPropertyApplication";
import { accountStatementResults } from "./searchResource/searchResults";

  const header = getCommonHeader({
    labelName: "Account Statement Generation",
    labelKey: "RP_COMMON_ACCOUNT_STATEMENT_GENERATION_APPLICATION"
  });

  const accountStatementSearchResult = {
    uiFramework: "material-ui",
    name: "search-account-statement",
    beforeInitScreen: (action, state, dispatch) => {
      dispatch(prepareFinalObject("searchScreen", {}))
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
                  sm: 6
                },
                ...header
              }
            }
          },
          accountStatementFilterForm,
          breakAfterSearch: getBreak(),
          accountStatementResults
        }
      }
    }
  };
  
  export default accountStatementSearchResult;
  