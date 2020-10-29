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
import { WF_ALLOTMENT_OF_SITE, BUILDING_BRANCH_TABS as tabs } from "../../../../ui-constants";
import { getReviewPropertyDetails } from "./applyResourceBuildingBranch/reviewDetails";

let fileNumber = getQueryArg(window.location.href, "fileNumber");
let tenantId = getTenantId();

export const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Property Master",
    labelKey: "ES_COMMON_PROPERTY_MASTER"
  })
});

const reviewPropertyDetails = getReviewPropertyDetails(false)
export const propertyReviewDetails = getCommonCard({
  reviewPropertyDetails
});

export const searchResults = async (action, state, dispatch, fileNumber) => {
  let queryObject = [
    { key: "fileNumber", value: fileNumber }
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
    const removedDocs = applicationDocuments.filter(item => !item.active)

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
    path = `/estate/search-preview-building-branch?fileNumber=${fileNumber}&tenantId=${tenantId}`;
  }
  else if (tabIndex === 1) {
    path = `/estate/owner-details-building-branch?fileNumber=${fileNumber}&tenantId=${tenantId}`
  }
  else if (tabIndex === 2) {
    path = `/estate/document-details-building-branch?fileNumber=${fileNumber}&tenantId=${tenantId}&tabIndex=${2}`
  }
  dispatch(setRoute(path))
}

const estateDetailPreview = {
  uiFramework: "material-ui",
  name: "search-preview-building-branch",
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
              moduleName: WF_ALLOTMENT_OF_SITE,
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

export default estateDetailPreview;