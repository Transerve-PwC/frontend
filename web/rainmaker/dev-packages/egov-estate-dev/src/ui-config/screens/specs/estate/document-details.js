import {
    getCommonCard,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject,handleScreenConfigurationFieldChange as handleField, toggleSpinner  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import {getReviewDocuments} from "./applyResource/reviewDocuments"
import {onTabChange, headerrow, tabs, tabsAllotment} from './search-preview'
import { setDocuments } from '../../../../ui-utils/commons';
import {
  BUILDING_BRANCH_TABS as tabsBB,
  MANIMAJRA_BRANCH_TABS as tabsMM
} from "../../../../ui-constants";
import get from "lodash/get";


let isPropertyMasterOrAllotmentOfSite;
let branchTabs = tabs;
let activeIndex = 3;

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
  }
}

const getData = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber){
    // await searchResults(action, state, dispatch, fileNumber)
    let queryObject = [
      { key: "fileNumber", value: fileNumber },
      {key: "relations", value: "owner,ownerdocs"}
    ];
    let payload = await getSearchResults(queryObject);
    if(payload) {
      let properties = payload.Properties;
      let owners = properties[0].propertyDetails.owners;
      let currOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == true);
      isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
      let branchType = properties[0].propertyDetails.branchType;
  
      properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, owners: currOwners}}]
      dispatch(prepareFinalObject("Properties", properties));

      switch(branchType) {
        case "ESTATE_BRANCH":
          branchTabs = (isPropertyMasterOrAllotmentOfSite == "PROPERTY_MASTER") ? tabs : tabsAllotment;
          break;
        case "BUILDING_BRANCH":
          branchTabs = tabsBB;
          activeIndex = 2;
          break;
        case "MANI_MAJRA":
          branchTabs = tabsMM;
          activeIndex = 2;
          break;
      }

      return {
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
                  tabs: branchTabs,
                  activeIndex: activeIndex,
                  onTabChange
                },
                type: "array",
              },
            documentContainer
          }
        }
      }
    }
  }
  
}

const updateAllFields = async (action, state, dispatch) => {
  const properties = get(state, "screenConfiguration.preparedFinalObject.Properties");
  isPropertyMasterOrAllotmentOfSite = properties[0].propertyMasterOrAllotmentOfSite;
  let containers={};
  let payload = {};
  payload.Properties = properties;

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

const commonDocumentDetails = {
  uiFramework: "material-ui",
  name: "document-details",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
      const fileNumber = getQueryArg(window.location.href, "fileNumber");
      dispatch(toggleSpinner())
      const components = await getData(action, state, dispatch, fileNumber)
      dispatch(toggleSpinner())
      setTimeout(() => updateAllFields(action, state, dispatch), 100)
      return {
        "type": "INIT_SCREEN",
        "screenKey": "document-details",
        "screenConfig": {
          "uiFramework": "material-ui",
          "name": "document-details",
          components
        }
      }
  }
}

export default commonDocumentDetails;