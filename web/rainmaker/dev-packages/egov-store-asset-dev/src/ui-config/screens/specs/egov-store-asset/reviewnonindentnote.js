import {
    getCommonHeader,
    getCommonContainer,
    getCommonSubHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { IndentNoteReviewDetails } from "./viewnonindentIssueNoteResource/indent-note-review";
  import { setRolesList } from "./viewnonindentIssueNoteResource/functions";
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Non-Indent Material Issue Note - Summary",
      labelKey: "STORE_MATERIAL_NON_INDENT_SUMMARY_HEADER"
    })
  });
  
  export const subHeader = getCommonContainer({
    subHeader: getCommonSubHeader({
      labelName:
        "Verify entered details before submission.",
      labelKey: "STORE_MATERIAL_MASTER_SUB_HEADER"
    })
  });
  
  const IndentNoteReview = IndentNoteReviewDetails(true);
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "reviewnonindentnote",
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
          IndentNoteReview
        }
      }
    }
  };
  
  export default screenConfig;
  