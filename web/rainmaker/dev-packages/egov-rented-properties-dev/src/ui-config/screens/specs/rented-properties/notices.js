import {
    getCommonHeader,
    getCommonContainer,
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {onTabChange, headerrow, tabs} from './search-preview'
import { getSearchResults } from "../../../../ui-utils/commons";
import {  downloadPrintContainer,footerReviewTop } from "./applyResource/reviewFooter";
import { set } from "lodash";
let transitNumber = getQueryArg(window.location.href, "transitNumber");

export const searchResults = async (action, state, dispatch, transitNumber) => {
  let queryObject = [
    { key: "transitNumber", value: transitNumber }
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    if(properties){
      dispatch(prepareFinalObject("Properties[0]", properties[0]));     
    }
  }

  


 }
 const beforeInitFn = async (action, state, dispatch, transitNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(transitNumber){
    await searchResults(action, state, dispatch, transitNumber)
  }
  const printCont = downloadPrintContainer(
    action,
    state,
    dispatch,
    // status,
    // applicationNumber,
    // tenantId
  );
  const CitizenprintCont=footerReviewTop(
    action,
    state,
    dispatch,
    // status,
    // applicationNumber,
    // tenantId,
    //financialYear
  );


  process.env.REACT_APP_NAME === "Citizen"
    ? set(
        action,
        "screenConfig.components.div.children.headerDiv.children.helpSection.children",
        CitizenprintCont
      )
    : set(
        action,
        "screenConfig.components.div.children.headerDiv.children.helpSection.children",
        printCont
      );



}

const notices = {
    uiFramework: "material-ui",
    name: "notices",
    beforeInitScreen: (action, state, dispatch) => {
      beforeInitFn(action, state, dispatch, transitNumber);
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css search-preview"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header1: {
                gridDefination: {
                  xs: 12,
                  sm: 8
                },
               ...headerrow
              },
              helpSection: {
                uiFramework: "custom-atoms",
                componentPath: "Container",
                props: {
                  color: "primary",
                  style: { justifyContent: "flex-end" }
                },
                gridDefination: {
                  xs: 12,
                  sm: 4,
                  align: "right"
                }
              }
              }
            },
            tabSection: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-rented-properties",
              componentPath: "CustomTabContainer",
              props: {
                tabs,
                onTabChange,
                activeIndex: 2
              },
              type: "array",
            },
            // write code for transit images
            viewFour: {
              uiFramework: "custom-containers-local",
              moduleName: "egov-rented-properties",
              componentPath: "MultipleDocumentsContainer",
              props: {
                sourceJsonPath:"Properties[0].notices",
                btnhide: false,
                businessService:"RP",
                className: "review-documents"
              }
            },
        }
      }
    }
  };

  export default notices;