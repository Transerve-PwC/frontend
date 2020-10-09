import {
    getCommonCard,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import {getReviewDocuments} from "./applyResource/reviewDocuments"
import {onTabChange, headerrow, tabs} from './search-preview'
import { setDocuments } from '../../../../ui-utils/commons'


let fileNumber = getQueryArg(window.location.href, "fileNumber");

const documentContainer = {
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
    {key: "relations", value: "owner,ownerdocs"}
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    let owners = properties[0].propertyDetails.owners;
    let currOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == true);
    properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, owners: currOwners}}]
    dispatch(prepareFinalObject("Properties", properties));

    payload.Properties = properties;

    let containers={}
    properties[0].propertyDetails.owners.forEach((element,index) => { 
    setDocuments(
    payload,
    `Properties[0].propertyDetails.owners[${index}].ownerDetails.ownerDocuments`,
    `PropertiesTemp[${index}].reviewDocData`,
    dispatch,'ES'
    );
    let documentListContainer = getReviewDocuments(false,'document-details',`PropertiesTemp[${index}].reviewDocData`);
    containers[index] = getCommonCard({
      documentListContainer
      }); 
    });
    dispatch(
      handleField(
      "document-details",
      "components.div.children.documentContainer",
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

const DocumentReviewDetails = {
  uiFramework: "material-ui",
  name: "document-details",
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
              activeIndex: 3,
              onTabChange
            },
            type: "array",
          },
        documentContainer
      }
    }
  }
};



export default DocumentReviewDetails;