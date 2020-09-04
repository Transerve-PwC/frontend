import {
    getCommonHeader,
    getBreak,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { ownerShipTransferApplication } from "./searchResource/rentedPropertyApplication";
import { searchTransferProperties } from "./searchResource/functions"
import { transferSearchResults } from "./searchResource/searchResults";
import { localStorageGet,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getStatusList } from "./search";
import { WORKFLOW_BUSINESS_SERVICE_OT } from "../../../../ui-constants";

  const header = getCommonHeader({
    labelName: "Transfer Properties",
    labelKey: "RP_COMMON_TRANSFER_PROPERTIES"
  });

  const transferPropertiesSearchAndResult = {
    uiFramework: "material-ui",
    name: "search-transfer-properties",
    beforeInitScreen: (action, state, dispatch) => {
      const queryObject = [{ key: "tenantId", value: getTenantId() }, 
                      { key: "businessServices", value: WORKFLOW_BUSINESS_SERVICE_OT }]
      dispatch(prepareFinalObject("searchScreen", {}))
      searchTransferProperties(state, dispatch, true)
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
          ownerShipTransferApplication,
          breakAfterSearch: getBreak(),
          transferSearchResults
        }
      }
    }
  };
  
  export default transferPropertiesSearchAndResult;
  