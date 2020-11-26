import {
  getCommonCard,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getSearchResults
} from "../../../../ui-utils/commons";
import {
  getReviewDocuments
} from "./applyResource/reviewDocuments"
import {
  onTabChange,
  headerrow,
  tabs
} from './search-preview'
import { setDocuments } from '../../../../ui-utils/commons';
import {
  BUILDING_BRANCH_TABS as tabsBB,
  MANIMAJRA_BRANCH_TABS as tabsMM
} from "../../../../ui-constants";
import get from "lodash/get";


let branchTabs = tabs;
let activeIndex = 5;

const documentContainer = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  props: {
    id: "docs"
  },
  children: {}
}

export const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    {key: "fileNumber", value: fileNumber},
    {key: "relations", value: "owner,ownerdocs"}
  ];
  let payload = await getSearchResults(queryObject);
  if (payload) {
    let properties = payload.Properties;
    let owners = properties[0].propertyDetails.owners;
    let prevOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == false);
    
    properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, purchaser: prevOwners}}]
    dispatch(prepareFinalObject("Properties", properties));
  }
}

const getData = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber) {
    // await searchResults(action, state, dispatch, fileNumber)
    let queryObject = [
      {key: "fileNumber", value: fileNumber},
      {key: "relations", value: "owner,ownerdocs"}
    ];
    let payload = await getSearchResults(queryObject);
    if (payload) {
      let properties = payload.Properties;
      let owners = properties[0].propertyDetails.owners;
      let prevOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == false);
      let branchType = properties[0].propertyDetails.branchType;

      switch(branchType) {
        case "ESTATE_BRANCH":
          branchTabs = tabs;
          activeIndex = 5;
          break;
        case "BUILDING_BRANCH":
          branchTabs = tabsBB;
          break;
        case "MANI_MAJRA":
          branchTabs = tabsMM;
          activeIndex = 4;
          break;
      }
      
      properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, purchaser: prevOwners}}]
      dispatch(prepareFinalObject("Properties", properties));

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
  
  let payload = {};
  payload.Properties = properties;

  


  let containers = {}
  properties[0].propertyDetails.purchaser.forEach((element, index) => {
    setDocuments(
      payload,
      `Properties[0].propertyDetails.purchaser[${index}].ownerDetails.ownerDocuments`,
      `PropertiesTemp[${index}].reviewDocDataPrevOwner`,
      dispatch, 'ES'
    );
    let documentListContainer = getReviewDocuments(false, 'document-details', `PropertiesTemp[${index}].reviewDocDataPrevOwner`, 5);
    containers[index] = getCommonCard({
      documentListContainer
    });
  });
  dispatch(
    handleField(
      "previous-owner-document-details",
      "components.div.children.documentContainer",
      "children",
      containers
    )
  );
}

const commonDocumentDetails = {
  uiFramework: "material-ui",
  name: "previous-owner-document-details",
  hasBeforeInitAsync: true,
  beforeInitScreen: async (action, state, dispatch) => {
      const fileNumber = getQueryArg(window.location.href, "fileNumber");
      dispatch(toggleSpinner())
      const components = await getData(action, state, dispatch, fileNumber)
      dispatch(toggleSpinner())
      setTimeout(() => updateAllFields(action, state, dispatch), 100)
      return {
        "type": "INIT_SCREEN",
        "screenKey": "previous-owner-document-details",
        "screenConfig": {
          "uiFramework": "material-ui",
          "name": "previous-owner-document-details",
          components
        }
      }
  }
}

export default commonDocumentDetails;