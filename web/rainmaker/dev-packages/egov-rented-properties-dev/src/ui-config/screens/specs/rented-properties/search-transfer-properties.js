import {
    getCommonHeader,
    getLabel,
    getBreak,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { localStorageGet,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import find from "lodash/find";
import get from "lodash/get";
import { transferPropertyApplication } from "./searchResource/transferPropertyApplication";
import { searchApiCall } from "./searchResource/functions"
import { searchResults } from "./searchResource/searchResults";
import { getColonyTypes } from "./apply";

  const header = getCommonHeader({
    labelName: "Ownership Transfer",
    labelKey: "RP_OWNERSHIP_TRANSFER_HEADER"
  });
  const transferPropertiesSearchAndResult = {
    uiFramework: "material-ui",
    name: "search",
    beforeInitScreen: (action, state, dispatch) => {
      dispatch(prepareFinalObject("searchScreen", {}))
      getColonyTypes(action, state, dispatch)
      searchApiCall(state, dispatch, true)
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
          transferPropertyApplication,
          breakAfterSearch: getBreak(),
          searchResults
        }
      }
    }
  };
  
  export default transferPropertiesSearchAndResult;
  