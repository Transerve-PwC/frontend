import {
    getCommonHeader,
    getLabel,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import set from "lodash/set";
  import { viewPropertyDetails } from "./viewPropertyDetails/propertyDetails-review";
  import { poViewFooter } from "./viewPropertyDetails/footer";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import {
    handleScreenConfigurationFieldChange as handleField,
    toggleSnackbar,
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";

  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `Property Details`,
      labelKey: "PT_COMMON_PROPERTY_DETAILS_HEADER"
    }),
  });

  
  const tradeView = viewPropertyDetails(false);
  


  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-propertyDetails",
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
                ...header,
              },
            }
          },
          tradeView,
          footer: poViewFooter(),
        }
      },
    }
  };
  
  export default screenConfig;
  