import {
  getCommonCard,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
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
import { setDocuments } from '../../../../ui-utils/commons'


let fileNumber = getQueryArg(window.location.href, "fileNumber");

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
    {key: "relations", value: "owner"}
  ];
  let payload = await getSearchResults(queryObject);
  if (payload) {
    let properties = payload.Properties;
    let owners = properties[0].propertyDetails.owners;
    let prevOwners = owners.filter(item => item.ownerDetails.isCurrentOwner == false);
    properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, purchaser: prevOwners}}]
    dispatch(prepareFinalObject("Properties", properties));

    payload.Properties = properties;

    let containers = {}
    properties[0].propertyDetails.purchaser.forEach((element, index) => {
      setDocuments(
        payload,
        `Properties[0].propertyDetails.purchaser[${index}].ownerDetails.ownerDocuments`,
        `PropertiesTemp[${index}].reviewDocDataPrevOwner`,
        dispatch, 'ES'
      );
      let documentListContainer = getReviewDocuments(false, 'document-details', `PropertiesTemp[${index}].
      PrevOwner`);
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
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber) {
    await searchResults(action, state, dispatch, fileNumber)
  }
}

const DocumentReviewDetails = {
  uiFramework: "material-ui",
  name: "previous-owner-document-details",
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
            activeIndex: 5,
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