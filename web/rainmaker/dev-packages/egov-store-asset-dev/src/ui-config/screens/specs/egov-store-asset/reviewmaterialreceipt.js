import {
    getCommonHeader,
    getCommonContainer,
    getCommonSubHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { MaterialReceiptReviewDetails } from "./viewMaterialReceiptNoteResource/receipt-note-review";
  import { setRolesList } from "./viewMaterialReceiptNoteResource/functions";
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Material Receipt Note  - Summary",
      labelKey: "STORE_MATERIAL_RECEIPT_NOTE_SUMMARY_HEADER"
    })
  });
  
  export const subHeader = getCommonContainer({
    subHeader: getCommonSubHeader({
      labelName:
        "Verify entered details before submission.",
      labelKey: "STORE_MATERIAL_MASTER_SUB_HEADER"
    })
  });
  
  const MaterialReceiptReview = MaterialReceiptReviewDetails(true);
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "reviewmaterialreceipt",
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
          MaterialReceiptReview
        }
      }
    }
  };
  
  export default screenConfig;
  