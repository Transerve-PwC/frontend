import {
    getCommonHeader,
    getCommonContainer,
    getCommonSubHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { IndentListReviewDetails } from "./viewindentResource/indent-review";
  import { setRolesList } from "./viewMaterialMasterResource/functions";
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Material Indent - Summary",
      labelKey: "STORE_MATERIAL_INDENT_SUMMARY_HEADER"
    })
  });
  
  export const subHeader = getCommonContainer({
    subHeader: getCommonSubHeader({
      labelName:
        "Verify entered details before submission.",
      labelKey: "STORE_MATERIAL_MASTER_SUB_HEADER"
    })
  });
  
  const PriceListReview = IndentListReviewDetails(true);
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "reviewindent",
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
          PriceListReview
        }
      }
    }
  };
  
  export default screenConfig;
  