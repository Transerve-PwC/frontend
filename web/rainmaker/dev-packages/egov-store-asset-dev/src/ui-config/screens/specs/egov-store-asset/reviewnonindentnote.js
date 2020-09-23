import {
    getCommonHeader,
    getCommonContainer,
    getCommonSubHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { IndentNoteReviewDetails } from "./viewnonindentIssueNoteResource/indent-note-review";
  import { setRolesList } from "./viewnonindentIssueNoteResource/functions";
import { httpRequest } from "../../../../ui-utils/api";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getstoreTenantId } from "../../../../ui-utils/storecommonsapi";

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
      labelKey: "STORE_PURCHASE_ORDER_SUB_HEADER"
    })
  });
  
  const IndentNoteReview = IndentNoteReviewDetails(true);
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
    name: "reviewnonindentnote",
    beforeInitScreen: (action, state, dispatch) => {
      // COMMA SEPARATED ROLES IN REVIEW SCREEN
      setRolesList(state, dispatch);
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
          IndentNoteReview
        }
      }
    }
  };
  
  export default screenConfig;
  