import {
  getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getCourtCaseDetails } from "./preview-resource/courtCase-details";
import {onTabChange, headerrow, tabs} from './search-preview'

let fileNumber = getQueryArg(window.location.href, "fileNumber");

const courtCaseContainer = {
  uiFramework: "custom-atoms",
componentPath: "Div",
props: {
  id: "docs"
},
children: {
}
}

export const searchResults = async (action, state, dispatch, fileNumber) => {
let queryObject = [
  { key: "fileNumber", value: fileNumber },
  {key: "relations", value: "court"}
];
let payload = await getSearchResults(queryObject);
if(payload) {
  let properties = payload.Properties;
    dispatch(prepareFinalObject("Properties", properties));
    
    let containers={}
    if(properties[0].propertyDetails.courtCases){
      properties[0].propertyDetails.courtCases.forEach((element,index) => { 
        let courtCaseDetails = getCourtCaseDetails(false,index);
        containers[index] = getCommonCard({
          courtCaseDetails
        });  
      });
    }
    dispatch(
      handleField(
      "court-case",
      "components.div.children.courtCaseContainer",
      "children",
      containers
      )
    );
}
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
dispatch(prepareFinalObject("workflow.ProcessInstances", []))
if(fileNumber){
    await searchResults(action, state, dispatch, fileNumber)
  }
}

const CourtCaseDetails = {
uiFramework: "material-ui",
name: "court-case",
beforeInitScreen: (action, state, dispatch) => {
  fileNumber = getQueryArg(window.location.href, "fileNumber");
  beforeInitFn(action, state, dispatch, fileNumber);
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
          }
        },
        tabSection: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "CustomTabContainer",
          props: {
            tabs,
            activeIndex: 9,
            onTabChange
          },
          type: "array",
        },
        courtCaseContainer
    }
  }
}
};

export default CourtCaseDetails;