import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
  getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { 
prepareFinalObject,
handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { MANIMAJRA_BRANCH_TABS as tabs, WF_MM_PROPERTY_MASTER } from "../../../../ui-constants";
import { getReviewPropertyDetails } from "./applyResourceBuildingBranch/reviewDetails";

let fileNumber = getQueryArg(window.location.href, "fileNumber");
let tenantId = getTenantId();

export const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Property Master",
    labelKey: "ES_COMMON_PROPERTY_MASTER"
  })
});

const reviewPropertyDetails = getReviewPropertyDetails(false);
const additionalDetails = getAdditionalDetails(false);

export const propertyReviewDetails = getCommonCard({
  reviewPropertyDetails,
  additionalDetails
});

export const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber }
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
    const removedDocs = applicationDocuments.filter(item => !item.active);
    let category = properties[0].category;

    /* based on selected category toggle display of sub-category field */
    dispatch(
      handleField(
        "search-preview-manimajra",
        `components.div.children.propertyReviewDetails.children.cardContent.children.reviewPropertyDetails.children.cardContent.children.viewFour.children.subCategory`,
        "visible",
        !!(category == "CAT.RESIDENTIAL" || category == "CAT.COMMERCIAL")
      )
    );

    applicationDocuments = applicationDocuments.filter(item => !!item.active)
    properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, applicationDocuments}}]
    dispatch(prepareFinalObject("Properties[0]", properties[0]));
    dispatch(
      prepareFinalObject(
        "PropertiesTemp[0].removedDocs",
        removedDocs
      )
    );
    await setDocuments(
      payload,
      "Properties[0].propertyDetails.applicationDocuments",
      "PropertiesTemp[0].reviewDocData",
      dispatch,
      'ES'
    );
  }
}

const beforeInitFn = async (action, state, dispatch, fileNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if (fileNumber){
    await searchResults(action, state, dispatch, fileNumber);
  }
}

export const onTabChange = async(tabIndex, dispatch, state) => {
  fileNumber = getQueryArg(window.location.href, "fileNumber");
  let path = "";
  if (tabIndex === 0) {
    path = `/estate/search-preview-manimajra?fileNumber=${fileNumber}&tenantId=${tenantId}`;
  }
  else if (tabIndex === 1) {
    path = `/estate/owner-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
  }
  else if (tabIndex === 2) {
    path = `/estate/document-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
  }
  else if (tabIndex === 3) {
    path = `/estate/purchaser-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
  }
  else if (tabIndex === 4) {
    path = `/estate/previous-owner-document-details?fileNumber=${fileNumber}&tenantId=${tenantId}`
  }
  else if (tabIndex === 6) {
    path = `/estate/rent-information?fileNumber=${fileNumber}&tenantId=${tenantId}`
  }
  else if (tabIndex === 8) {
    path = `/estate/court-case?fileNumber=${fileNumber}&tenantId=${tenantId}`
  }
  dispatch(setRoute(path))
}

const propertyMasterPreview = {
  uiFramework: "material-ui",
  name: "search-preview-manimajra",
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
            }
          }
        },
        tabSection: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-estate",
          componentPath: "CustomTabContainer",
          props: {
            tabs,
            activeIndex: 0,
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
              moduleName: WF_MM_PROPERTY_MASTER,
              updateUrl: "/est-services/property-master/_update",
              style: {
                wordBreak: "break-word"
              }
            }
          },
        propertyReviewDetails
      }
    }
  }
};

export default propertyMasterPreview;