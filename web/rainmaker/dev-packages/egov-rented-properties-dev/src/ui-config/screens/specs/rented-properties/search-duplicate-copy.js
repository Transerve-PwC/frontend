import {
    getCommonHeader,
    getBreak,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { searchDuplicateCopyApplication } from "./searchResource/rentedPropertyApplication";
import { searchDuplicateCopy } from "./searchResource/functions"
import { getStatusList } from "./search";
import { duplicateCopySearchResult } from "./searchResource/searchResults";
import { WORKFLOW_BUSINESS_SERVICE_DC } from "../../../../ui-constants";

  const header = getCommonHeader({
    labelName: "Duplicate copy of Allotment letter",
    labelKey: "DUPLICATE_COPY_HEADER"
  });
  const duplicateCopySearchAndResult = {
    uiFramework: "material-ui",
    name: "search-duplicate-copy",
    beforeInitScreen: (action, state, dispatch) => {
      const queryObject = [{ key: "tenantId", value: getTenantId() }, 
                      { key: "businessServices", value: WORKFLOW_BUSINESS_SERVICE_DC }]
      dispatch(prepareFinalObject("searchScreen", {}))
      searchDuplicateCopy(state, dispatch, true)
      getStatusList(action, state, dispatch, queryObject, "search-duplicate-copy", "components.div.children.searchDuplicateCopyApplication.children.cardContent.children.statusContainer.children.status")
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
          searchDuplicateCopyApplication,
          breakAfterSearch: getBreak(),
          duplicateCopySearchResult
        }
      }
    }
  };
  
  export default duplicateCopySearchAndResult;
  