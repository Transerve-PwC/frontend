import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
  getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getCourtCaseDetails } from "./preview-resource/courtCase-details";
import { getUserInfo ,getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import {onTabChange, headerrow, tabs} from './search-preview'


const userInfo = JSON.parse(getUserInfo());
const {roles = []} = userInfo
const findItem = roles.find(item => item.code === "CTL_CLERK");

let fileNumber = getQueryArg(window.location.href, "fileNumber");

const courtCaseContainer = {
  uiFramework: "custom-atoms",
componentPath: "Container",
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
  fileNumber = getQueryArg(window.location.href, "filenumber");
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
            activeIndex: 6,
            onTabChange
          },
          type: "array",
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "WorkFlowContainer",
          props: {
            dataPath: "Properties",
            moduleName: "PropertyMaster",
            updateUrl: "/property-service/property-master/_update",
            style: {
              wordBreak: "break-word"
            }
          }
        },
        courtCaseContainer
    }
  }
}
};

export default CourtCaseDetails;