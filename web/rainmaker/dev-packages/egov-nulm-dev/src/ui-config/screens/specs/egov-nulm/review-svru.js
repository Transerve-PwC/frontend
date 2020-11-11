import {
    getCommonHeader,
    getCommonContainer,
    getCommonSubHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";

  import { SEPReviewDetails } from "./viewSVRUResource/sep-review";
  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Street Vendor Registration Update- Summary",
      labelKey: "NULM_SVRU_SUMMARY"
    })
  });
  
  export const subHeader = getCommonContainer({
    subHeader: getCommonSubHeader({
      labelName:
        "Verify entered details before submission.",
      labelKey: "STORE_PURCHASE_ORDER_SUB_HEADER"
    })
  });
  
  const tradeReview = SEPReviewDetails(true);
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "review-svru",
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
  