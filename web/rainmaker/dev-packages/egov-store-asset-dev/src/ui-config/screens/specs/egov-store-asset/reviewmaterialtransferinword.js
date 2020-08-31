import {
    getCommonHeader,
    getCommonContainer,
    getCommonSubHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { MaterialTransferInwordReviewDetails } from "./viewMaterialTransferInwordResource/inword-note-review";
  import { setRolesList } from "./viewMaterialReceiptNoteMiscResource/functions";
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Material Transfer Inword Note - Summary",
      labelKey: "STORE_MTIN_SUMMARY"
    })
  });
  
  export const subHeader = getCommonContainer({
    subHeader: getCommonSubHeader({
      labelName:
        "Verify entered details before submission.",
      labelKey: "STORE_MATERIAL_MASTER_SUB_HEADER"
    })
  });
  
  const MaterialTransferInwordReview = MaterialTransferInwordReviewDetails(true);
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "reviewmaterialtransferinword",
    beforeInitScreen: (action, state, dispatch) => {
      // COMMA SEPARATED ROLES IN REVIEW SCREEN
      setRolesList(state, dispatch);
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
          MaterialTransferInwordReview
        }
      }
    }
  };
  
  export default screenConfig;
  