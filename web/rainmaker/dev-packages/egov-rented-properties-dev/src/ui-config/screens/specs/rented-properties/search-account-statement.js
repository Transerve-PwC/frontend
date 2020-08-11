import {
    getCommonHeader,
    getBreak,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { accountStatementGenerationApplications,accountStatementFilter } from "./searchResource/rentedPropertyApplication";
import { searchTransferProperties } from "./searchResource/functions"
import { accountStatementResults } from "./searchResource/searchResults";
import { localStorageGet,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getStatusList } from "./search";

  const header = getCommonHeader({
    labelName: "Account Statement Generation",
    labelKey: "RP_COMMON_ACCOUNT_STATEMENT_GENERATION_APPLICATION"
  });

  const accountStatementSearchResult = {
    uiFramework: "material-ui",
    name: "search-account-statement",
    beforeInitScreen: (action, state, dispatch) => {
      const queryObject = [{ key: "tenantId", value: getTenantId() }, 
                      { key: "businessServices", value: "OwnershipTransferRP" }]
      dispatch(prepareFinalObject("searchScreen", {}))
    //   searchTransferProperties(state, dispatch, true)
      getStatusList(action, state, dispatch, queryObject, "search-transfer-properties", "components.div.children.ownerShipTransferApplication.children.cardContent.children.statusContainer.children.status")
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
          accountStatementGenerationApplications,
          accountStatementFilter,
          breakAfterSearch: getBreak(),
          accountStatementResults
        }
      }
    }
  };
  
  export default accountStatementSearchResult;
  