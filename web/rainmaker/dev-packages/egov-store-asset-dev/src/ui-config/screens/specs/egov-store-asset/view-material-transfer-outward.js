import {
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  import { MTONReviewDetails } from "./viewMTONResource/mton-review";
  import { poViewFooter } from "./viewMTONResource/footer";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View Material Transfer Outward Note`,
      labelKey: "STORE_MTON_VIEW"
    })
  });
  
  const tradeView = MTONReviewDetails(false);
  
  const getMdmsData = async (action, state, dispatch, tenantId) => {
    const tenant = getstoreTenantId();
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenant,
        moduleDetails: [
          {
            moduleName: "egov-hrms",
            masterDetails: [
              {
                name: "DeactivationReason",
                filter: "[?(@.active == true)]"
              }
            ]
          }
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-material-transfer-outward",
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
                ...header
              }
            }
          },
          tradeView,
          footer: poViewFooter()
        }
      },
    }
  };
  
  export default screenConfig;
  