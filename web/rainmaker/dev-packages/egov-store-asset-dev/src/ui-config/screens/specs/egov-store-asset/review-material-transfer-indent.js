import {
    getCommonHeader,
    getCommonContainer,
    getCommonSubHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { MTIReviewDetails } from "./viewMTIResource/mti-review";
import { httpRequest } from "../../../../ui-utils/api";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";

  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Material Transfer Indent - Summary",
      labelKey: "STORE_MTI_SUMMARY"
    })
  });
  
  export const subHeader = getCommonContainer({
    subHeader: getCommonSubHeader({
      labelName:
        "Verify entered details before submission.",
      labelKey: "STORE_PURCHASE_ORDER_SUB_HEADER"
    })
  });
  
  const tradeReview = MTIReviewDetails(true);
  const getMdmsData = async (action, state, dispatch) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: getstoreTenantId(),
        moduleDetails: [
          {
            moduleName: "store-asset",
            masterDetails: [
              { name: "businessService" },
            ]
          }
        ]
      }
    };
    try {
      const response = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("businessServiceTypeData", get(response, "MdmsRes")));
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async (action, state, dispatch) => {
    await getMdmsData(action, state, dispatch);
  }  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "review-material-transfer-indent",
    beforeInitScreen: (action, state, dispatch) => {
      getData(action, state, dispatch);  
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
              },
              subHeader: {
                gridDefination: {
                  xs: 12,
                  sm: 10
                },
                ...subHeader
              }
            }
          },
          tradeReview
        }
      }
    }
  };
  
  export default screenConfig;
  