import {
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getOwnerDetails,getAllotmentDetails } from "../estate/preview-resource/owner-properties";
import {onTabChange, headerrow, tabs} from './estate-branch-search-preview'


let fileNumber = getQueryArg(window.location.href, "fileNumber");

const ownerContainer = {
  uiFramework: "custom-atoms",
componentPath: "Div",
props: {
  id: "owner"
},
children: {
}
}

export const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber },
    {key: "relations", value: "owner"}
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    dispatch(prepareFinalObject("Properties", properties));
    
    let containers={}
    if(properties[0].propertyDetails.owners){
      properties[0].propertyDetails.owners.forEach((element,index) => { 
        let ownerdetailsComponent = getOwnerDetails(false,index);
        let allotmentDetailsComponent = getAllotmentDetails(false,index);
        containers[index] = getCommonCard({
          ownerdetailsComponent,
          allotmentDetailsComponent
        });  
      });
    }
    
    dispatch(
      handleField(
      "estate-branch-owner-details",
      "components.div.children.ownerContainer",
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


const EstateBranchOwnerDetails = {
  uiFramework: "material-ui",
  name: "estate-branch-owner-details",
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
              activeIndex: 1,
              onTabChange
            },
            type: "array",
          },
          ownerContainer
      }
    }
  }
};

export default EstateBranchOwnerDetails;